export interface CatalogFile {
  name: string
  format: string
  details: string
}

export function selectCatalogFile(
  file: Pick<File, 'name' | 'size'>,
): { file: CatalogFile } | { error: string } {
  const format = /\.(xlsx?|csv|pdf)$/i.exec(file.name)?.[1]?.toUpperCase()
  if (!format) return { error: 'Выберите файл Excel, CSV или PDF.' }
  if (file.size === 0) return { error: 'Файл пуст. Выберите другой файл.' }
  if (file.size > 50 * 1024 * 1024) return { error: 'Файл превышает лимит 50 МБ.' }
  const unit = file.size < 1024 * 1024 ? 'КБ' : 'МБ'
  const size = file.size / (unit === 'КБ' ? 1024 : 1024 * 1024)
  return {
    file: {
      name: file.name,
      format,
      details:
        Math.max(0.1, size).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' ' + unit,
    },
  }
}
