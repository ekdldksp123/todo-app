import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (import.meta.env.MODE === 'development') {
  // 개발 모드에서만 MSW worker 실행
  import('./mocks/browser.ts')
    .then(({ worker }) => {
      return worker.start({
        quiet: true,
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/todo-app/mockServiceWorker.js',
        },
      })
    })
    .then(() => {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
    })
} else {
  // 프로덕션 모드에서는 바로 렌더링
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
