import { createRoot } from 'react-dom/client'
import "./index.css"
import App from './App'
import {Provider} from "react-redux"
import store from "./store/store";
import React, { Suspense } from 'react'

const LazyToaster = React.lazy(() => import('react-hot-toast').then(mod => ({ default: mod.Toaster })));

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    <Suspense fallback={null}>
      <LazyToaster />
    </Suspense>
  </Provider>
)
