// Node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

// Services
import { getQuoteDate, parseFolderHtml } from '../src/ceasa/drive.js'


// Captured from the public "10/2026 Outubro" folder.
const html = readFileSync(
  new URL('./fixtures/month-folder.html', import.meta.url),
  'utf8'
)


test('lists the quote files of a month folder', () => {
  const entries = parseFolderHtml(html)

  assert.ok(entries.length >= 13)

  const today = entries.find(entry => entry.name === 'Cotacao 19/10/2026.pdf')

  assert.deepEqual(today, {
    id: '1WYQbP8Ih2Ss04qoz-pjfcONA4qLsjLB9',
    name: 'Cotacao 19/10/2026.pdf',
    isFolder: false
  })
})

test('detects folders by their link', () => {
  const entries = parseFolderHtml(
    '<a href="https://drive.google.com/drive/folders/abc_123"><div class="flip-entry-title">10/2026 Outubro</div></a>'
  )

  assert.deepEqual(entries, [
    { id: 'abc_123', name: '10/2026 Outubro', isFolder: true }
  ])
})

test('getQuoteDate reads DD/MM/AAAA from the file name', () => {
  assert.equal(getQuoteDate('Cotacao 05/10/2026.pdf'), '2026-10-05')
  assert.equal(getQuoteDate('Cotação 05/10/2026.PDF'), '2026-10-05')
  assert.equal(getQuoteDate('Resumo mensal.pdf'), null)
})
