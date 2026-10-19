// Firebase
import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { setGlobalOptions } from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'

// Services
import { syncCeasaPrices } from './ceasa/syncPrices.js'


initializeApp()

setGlobalOptions({
  region: 'southamerica-east1',
  // One import at a time.
  maxInstances: 1
})

const db = getFirestore()

// Same admin as the web app's Settings screen.
const ADMIN_EMAILS = ['jpchagas@gmail.com']

const RUN_OPTIONS = {
  timeoutSeconds: 540,
  memory: '512MiB'
}


// Records the outcome in meta/ceasa, which the app shows in Settings.
async function runSync(trigger) {
  const statusRef = db.doc('meta/ceasa')

  try {
    const result = await syncCeasaPrices({ db, logger })

    await statusRef.set(
      {
        lastRunAt: FieldValue.serverTimestamp(),
        lastStatus: 'ok',
        lastError: null,
        lastTrigger: trigger,
        ...(result.importedDates.length > 0 && {
          latestFileDate: result.importedDates.at(-1),
          lastImportAt: FieldValue.serverTimestamp()
        })
      },
      { merge: true }
    )

    logger.info('CEASA sync finished', { trigger, ...result })

    return result
  } catch (error) {
    logger.error('CEASA sync failed', { trigger, error: error.message })

    await statusRef.set(
      {
        lastRunAt: FieldValue.serverTimestamp(),
        lastStatus: 'error',
        lastError: error.message,
        lastTrigger: trigger
      },
      { merge: true }
    )

    throw error
  }
}


// CEASA publishes once per business day, usually between 7h and 11h.
// Extra runs are cheap no-ops and catch late publications.
export const syncCeasaPricesDaily = onSchedule(
  {
    ...RUN_OPTIONS,
    schedule: '0 9,12,16 * * 1-6',
    timeZone: 'America/Sao_Paulo',
    retryCount: 1
  },
  async () => {
    await runSync('schedule')
  }
)


// "Atualizar agora" in the app's Settings (admin only).
export const refreshCeasaPrices = onCall(RUN_OPTIONS, async request => {
  const email = request.auth?.token?.email

  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new HttpsError('permission-denied', 'Only admins can refresh prices.')
  }

  try {
    return await runSync('manual')
  } catch (error) {
    throw new HttpsError('internal', error.message)
  }
})
