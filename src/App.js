import React from 'react';
import InvoiceForm from './components/InvoiceForm';
import './styles.css';

function App() {
    return (
        <div className="App">
            <header>
                <h1>Invoice Generator</h1>
            </header>
            <main>
                <InvoiceForm />
            </main>
        </div>
    );
}

export default App;
