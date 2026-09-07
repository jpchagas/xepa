// Third-party

import * as XLSX from 'xlsx'


function usePriceUpload({ showAlert }) {
  const extractDateFromFileName =
    fileName => {
      const match =
        fileName.match(
          /(\d{2})_(\d{2})_(\d{4})/
        )

      if (!match) return null

      const [
        _,
        day,
        month,
        year
      ] = match

      return `${year}-${month}-${day}`
    }

  const normalizeProductId = name =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(/\s+/g, '_')
      .replace(/[()\/]/g, '')

  const handlePriceUpload =
    async event => {
      const file =
        event.target.files[0]

      if (!file) return

      try {
        const fileDate =
          extractDateFromFileName(
            file.name
          )

        if (!fileDate) {
          showAlert(
            'warning',
            'Nome do arquivo inválido. Use padrão: Cotação DD_MM_AAAA.xlsx'
          )

          return
        }

        const data =
          await file.arrayBuffer()

        const workbook =
          XLSX.read(data)

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ]

        const json =
          XLSX.utils.sheet_to_json(
            sheet
          )

        if (!json.length) {
          showAlert(
            'warning',
            'Planilha vazia.'
          )

          return
        }

        const requiredColumns = [
          'Produto',
          'UND',
          'MAX',
          'MAIS FREQUENTE',
          'MÍNIMO'
        ]

        const fileColumns =
          Object.keys(json[0])

        const missingColumns =
          requiredColumns.filter(
            column =>
              !fileColumns.includes(
                column
              )
          )

        if (
          missingColumns.length > 0
        ) {
          showAlert(
            'warning',
            `Colunas faltando: ${missingColumns.join(', ')}`
          )

          return
        }

        // Kept for Step 6
      } catch (error) {
        console.error(error)

        showAlert(
          'error',
          'Erro ao processar planilha.'
        )
      }
    }

  return {
    handlePriceUpload
  }
}

export default usePriceUpload