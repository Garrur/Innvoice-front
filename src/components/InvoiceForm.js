import React, { useState } from 'react';
import axios from 'axios';

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        seller: { name: '', address: '', pan: '', gst: '' },
        placeOfSupply: '',
        billing: { name: '', address: '', stateCode: '' },
        shipping: { name: '', address: '', stateCode: '' },
        placeOfDelivery: '',
        order: { orderNo: '', orderDate: '' },
        invoice: { invoiceNo: '', invoiceDate: '', reverseCharge: '' },
        items: [{ description: '', unitPrice: 0, quantity: 0, discount: 0 }],
        logo: '',
        signature: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length === 1) {
            setFormData({ ...formData, [name]: value });
        } else {
            const [mainKey, subKey] = keys;
            setFormData({
                ...formData,
                [mainKey]: {
                    ...formData[mainKey],
                    [subKey]: value
                }
            });
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index][name] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', unitPrice: 0, quantity: 0, discount: 0 }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/generate-invoice', formData, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'invoice.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error generating invoice:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <section>
                <h2>Seller Details</h2>
                <input type="text" name="seller.name" placeholder="Name" onChange={handleChange} />
                <input type="text" name="seller.address" placeholder="Address" onChange={handleChange} />
                <input type="text" name="seller.pan" placeholder="PAN" onChange={handleChange} />
                <input type="text" name="seller.gst" placeholder="GST" onChange={handleChange} />
            </section>
            <section>
                <h2>Billing Details</h2>
                <input type="text" name="billing.name" placeholder="Name" onChange={handleChange} />
                <input type="text" name="billing.address" placeholder="Address" onChange={handleChange} />
                <input type="text" name="billing.stateCode" placeholder="State Code" onChange={handleChange} />
            </section>
            <section>
                <h2>Shipping Details</h2>
                <input type="text" name="shipping.name" placeholder="Name" onChange={handleChange} />
                <input type="text" name="shipping.address" placeholder="Address" onChange={handleChange} />
                <input type="text" name="shipping.stateCode" placeholder="State Code" onChange={handleChange} />
            </section>
            <section>
                <h2>Order Details</h2>
                <input type="text" name="order.orderNo" placeholder="Order No." onChange={handleChange} />
                <input type="text" name="order.orderDate" placeholder="Order Date" onChange={handleChange} />
            </section>
            <section>
                <h2>Invoice Details</h2>
                <input type="text" name="invoice.invoiceNo" placeholder="Invoice No." onChange={handleChange} />
                <input type="text" name="invoice.invoiceDate" placeholder="Invoice Date" onChange={handleChange} />
                <input type="text" name="invoice.reverseCharge" placeholder="Reverse Charge" onChange={handleChange} />
            </section>
            <section>
                <h2>Items</h2>
                {formData.items.map((item, index) => (
                    <div key={index}>
                        <input type="text" name="description" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="unitPrice" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="discount" placeholder="Discount" value={item.discount} onChange={(e) => handleItemChange(index, e)} />
                    </div>
                ))}
                <button type="button" onClick={addItem}>Add Item</button>
            </section>
            <section>
                <h2>Other Details</h2>
                <input type="text" name="placeOfSupply" placeholder="Place of Supply" onChange={handleChange} />
                <input type="text" name="placeOfDelivery" placeholder="Place of Delivery" onChange={handleChange} />
                <input type="text" name="logo" placeholder="Logo URL" onChange={handleChange} />
                <input type="text" name="signature" placeholder="Signature URL" onChange={handleChange} />
            </section>
            <button type="submit">Generate Invoice</button>
        </form>
    );
};

export default InvoiceForm;
