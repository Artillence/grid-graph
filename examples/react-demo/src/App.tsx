import { useState } from 'react'
import './App.css'
import Examples from './examples'
import Playground from './Playground'

function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'examples'>('playground')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grid-Graph</h1>
              <p className="text-sm text-gray-600">Interactive graph visualization component</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('playground')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'playground'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Playground
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'examples'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Examples
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {activeTab === 'playground' ? <Playground /> : <Examples />}
    </div>
  )
}

export default App
