import { useRef, useState } from 'react'

import { selectCatalogFile, type CatalogFile } from './catalog-file'

const uploadIcon = new URL('./assets/upload.svg', import.meta.url).href
const removeIcon = new URL('./assets/remove.svg', import.meta.url).href
const arrowIcon = new URL('./assets/continue.svg', import.meta.url).href

const example: CatalogFile = {
  name: 'catalog_november.xlsx',
  format: 'XLSX',
  details: '2,4 МБ · 1 248 строк · 8 столбцов',
}
const steps = ['Загрузка файла', 'Сопоставление', 'Проверка', 'Результат']
const history = [
  ['price_october.csv', '24 ноября, 11:42', '856 товаров'],
  ['catalog_autumn.xlsx', '21 ноября, 09:18', '1 104 товара'],
  ['new_arrivals.pdf', '19 ноября, 16:05', '32 товара'],
]
const processSteps = [
  ['Сопоставим поля', 'Название, артикул, цена и атрибуты'],
  ['Подготовим каталог', 'Очистим данные и найдём ошибки'],
  ['Дадим проверить результат', 'Публикация — только с вашего согласия'],
]

function History() {
  return (
    <ul aria-label='История импортов'>
      {history.map(([name, date, count]) => (
        <li className='history-row' key={name}>
          <strong>{name}</strong>
          <span>{date}</span>
          <span>{count}</span>
          <span className='green'>Завершён</span>
        </li>
      ))}
    </ul>
  )
}

export function App() {
  const [file, setFile] = useState<CatalogFile | null>(example)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [mapping, setMapping] = useState(false)
  const [connected, setConnected] = useState(true)
  const [panel, setPanel] = useState<'history' | 'store'>('history')
  const picker = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  function choose(files: FileList | null) {
    if (!files?.length) return
    if (files.length !== 1) {
      setError('Выберите один файл каталога.')
      return
    }
    const result = selectCatalogFile(files[0])
    if ('error' in result) {
      setError(result.error)
      return
    }
    setError('')
    setFile(result.file)
  }
  function openPanel(view: typeof panel) {
    setPanel(view)
    dialog.current?.showModal()
  }
  return (
    <>
      <header className='topbar'>
        <div className='top-inner'>
          <nav aria-label='Хлебные крошки'>
            Каталог <i>/</i> <button onClick={() => openPanel('history')}>Импорты</button> <i>/</i>{' '}
            <strong>Новый импорт</strong>
          </nav>
          <span className='demo'>Демо-данные</span>
        </div>
      </header>
      <main className='workspace'>
        <h1>От файла — к товарам в магазине</h1>
        <p className='subtitle'>Загрузите каталог поставщика. Рутину возьмёт на себя агент.</p>
        <ol className='steps' aria-label='Этапы импорта'>
          {steps.map((step, i) => (
            <li key={step} aria-current={i === Number(mapping) ? 'step' : undefined}>
              <b>{i + 1}</b>
              {step}
            </li>
          ))}
        </ol>
        <div className='columns'>
          <div className='stack'>
            <section className='card source'>
              {mapping && file ? (
                <>
                  <div className='row'>
                    <h2>Сопоставление полей</h2>
                    <small>ДЕМО</small>
                  </div>
                  <p className='mapping-file'>{file.name}</p>
                  <p>
                    Файл выбран для сопоставления. Обработка содержимого появится после подключения
                    агента.
                  </p>
                  <button className='link' onClick={() => setMapping(false)}>
                    ← Вернуться к загрузке
                  </button>
                </>
              ) : (
                <>
                  <div className='row'>
                    <h2>Файл поставщика</h2>
                    <small>01 / ИСТОЧНИК</small>
                  </div>
                  <input
                    type='file'
                    hidden
                    ref={picker}
                    accept='.xlsx,.xls,.csv,.pdf'
                    aria-label='Файл поставщика'
                    onChange={(e) => {
                      choose(e.currentTarget.files)
                      e.currentTarget.value = ''
                    }}
                  />
                  <button
                    className='drop'
                    data-dragging={dragging}
                    onClick={() => picker.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragging(false)
                      choose(e.dataTransfer.files)
                    }}
                  >
                    <img src={uploadIcon} alt='' />
                    <strong>Перетащите файл сюда</strong>
                    <span className='green'>или выберите на компьютере</span>
                    <span className='hint'>Excel, CSV или PDF · до 50 МБ</span>
                  </button>
                  {error && (
                    <p role='alert' className='error'>
                      {error}
                    </p>
                  )}
                  {file && (
                    <div className='file-row'>
                      <b className='format'>{file.format}</b>
                      <div className='file-info'>
                        <strong>{file.name}</strong>
                        <p>{file.details}</p>
                      </div>
                      <span className='badge'>{file === example ? 'Загружен' : 'Выбран'}</span>
                      <button
                        aria-label='Удалить файл'
                        className='remove'
                        onClick={() => {
                          setFile(null)
                          setError('')
                        }}
                      >
                        <img src={removeIcon} alt='' />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
            <section className='card history'>
              <div className='row'>
                <h2>Последние импорты</h2>
                <button onClick={() => openPanel('history')}>Вся история ↗</button>
              </div>
              <History />
            </section>
          </div>
          <div className='stack'>
            <section className='card store'>
              <div className='row'>
                <h2>Куда отправляем</h2>
                <small>02 / МАГАЗИН</small>
              </div>
              <div className='row shop-name'>
                <h3>Демо-магазин</h3>
                <span className='badge'>{connected ? 'Подключён' : 'Отключён'}</span>
              </div>
              <p className='hint'>Прямое подключение по API</p>
              <div className='schema'>
                <strong>{connected ? 'Структура каталога получена' : 'Магазин отключён'}</strong>
                <p>
                  {connected
                    ? '8 полей · товары и категории'
                    : 'Подключите магазин для продолжения'}
                </p>
              </div>
              <button className='link row w-full' onClick={() => openPanel('store')}>
                Настроить интеграцию <span>↗</span>
              </button>
            </section>
            <section className='card process'>
              <h2>От загрузки до публикации</h2>
              <ol>
                {processSteps.map(([name, desc], i) => (
                  <li key={name}>
                    <small>0{i + 1}</small>
                    <div>
                      <strong>{name}</strong>
                      <p>{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className='note'>В макете — пример API-интеграции.</p>
            </section>
          </div>
        </div>
        <footer className='row'>
          <span>Файлы обрабатываются в вашем пространстве</span>
          {!mapping && (
            <button
              className='primary'
              disabled={!file || !connected}
              onClick={() => setMapping(true)}
            >
              Продолжить <img src={arrowIcon} alt='' />
            </button>
          )}
        </footer>
      </main>
      <dialog ref={dialog} aria-labelledby='panel-title'>
        <div className='row'>
          <h2 id='panel-title'>
            {panel === 'history' ? 'История импортов' : 'Интеграция демо-магазина'}
          </h2>
          <button onClick={() => dialog.current?.close()}>Закрыть</button>
        </div>
        {panel === 'history' ? (
          <History />
        ) : (
          <label>
            <input
              type='checkbox'
              checked={connected}
              onChange={(e) => {
                setConnected(e.target.checked)
                setMapping(false)
              }}
            />{' '}
            Подключить демо-магазин
          </label>
        )}
      </dialog>
    </>
  )
}
