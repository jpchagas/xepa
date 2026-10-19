// React
import { useState } from 'react'

// Firebase
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'

import { db } from '../services/firebase'


const REQUIRED_COLUMNS = [
  'Produto',
  'UND',
  'MAX',
  'MAIS FREQUENTE',
  'MÍNIMO'
]

// Firestore allows 500 operations per batch.
const BATCH_SIZE = 450


// "Cotação 12_09_2026.xlsx" -> "2026-09-12"
const extractDateFromFileName = fileName => {
  const match =
    fileName.match(/(\d{2})_(\d{2})_(\d{4})/)

  if (!match) return null

  const [, day, month, year] = match

  return `${year}-${month}-${day}`
}

// Must stay identical to the ids already stored in Firestore.
const normalizeProductId = name =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[()/]/g, '')


function usePriceUpload({ showAlert }) {
  const [uploading, setUploading] = useState(false)

  const handlePriceUpload = async event => {
    const input = event.target
    const file = input.files?.[0]

    // Allow picking the same file again later.
    input.value = ''

    if (!file) return

    const fileDate =
      extractDateFromFileName(file.name)

    if (!fileDate) {
      showAlert(
        'warning',
        'Nome do arquivo inválido. Use o padrão: Cotação DD_MM_AAAA.xlsx'
      )

      return
    }

    setUploading(true)

    try {
      const XLSX = await import('xlsx')

      const workbook =
        XLSX.read(await file.arrayBuffer())

      const rows =
        XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        )

      if (!rows.length) {
        showAlert('warning', 'Planilha vazia.')
        return
      }

      const fileColumns = Object.keys(rows[0])

      const missingColumns =
        REQUIRED_COLUMNS.filter(
          column => !fileColumns.includes(column)
        )

      if (missingColumns.length > 0) {
        showAlert(
          'warning',
          `Colunas faltando: ${missingColumns.join(', ')}`
        )

        return
      }

      // One read for all products instead of one per row.
      const productsSnap =
        await getDocs(collection(db, 'products'))

      const knownProductIds = new Set(
        productsSnap.docs.map(docSnap => docSnap.id)
      )

      const writes = []
      let updatedCount = 0

      for (const row of rows) {
        const name = row['Produto']

        if (!name) continue

        const max = Number(row['MAX'])
        const min = Number(row['MÍNIMO'])
        const average = Number(row['MAIS FREQUENTE'])
        const unit = row['UND'] || null

        if (isNaN(max) || isNaN(min) || isNaN(average)) continue
        if (!(min <= average && average <= max)) continue

        const productId =
          normalizeProductId(String(name))

        if (!knownProductIds.has(productId)) {
          writes.push([
            doc(db, 'products', productId),
            {
              name: String(name),
              unit,
              createdAt: serverTimestamp()
            }
          ])

          knownProductIds.add(productId)
        }

        writes.push([
          doc(db, 'prices', productId, 'history', fileDate),
          {
            max,
            min,
            average,
            fileDate,
            uploadedAt: serverTimestamp()
          }
        ])

        updatedCount++
      }

      if (updatedCount === 0) {
        showAlert('warning', 'Nenhuma linha válida encontrada.')
        return
      }

      for (let start = 0; start < writes.length; start += BATCH_SIZE) {
        const batch = writeBatch(db)

        writes
          .slice(start, start + BATCH_SIZE)
          .forEach(([ref, data]) => batch.set(ref, data))

        await batch.commit()
      }

      showAlert(
        'success',
        `${updatedCount} produtos atualizados com sucesso!`
      )
    } catch (error) {
      console.error(error)

      showAlert('error', 'Erro ao processar planilha.')
    } finally {
      setUploading(false)
    }
  }

  return {
    uploading,
    handlePriceUpload
  }
}

export default usePriceUpload
