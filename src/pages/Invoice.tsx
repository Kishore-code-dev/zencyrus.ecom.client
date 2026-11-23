import React from "react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";

const Invoice: React.FC = () =>
{
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { orderId = "" } = useParams<Readonly<Partial<{ orderId: string }>>>()

  console.log(orderId)

  const invoiceData = {
    company: {
      name: "Acme Technologies Pvt. Ltd.",
      address: "42, Gandhipuram, Avinashi Road, Coimbatore — 641018",
      gstin: "33AABCA1234B1ZP",
      phone: "+91 98765 43210",
    },

    invoice: {
      number: "INV-2025-0042",
      date: "13 Apr 2025",
      dueDate: "13 May 2025",
      place: "Maharashtra",
    },

    irn: {
      number: "a5c3e9f1b2d4e6a8c0f2e4b6d8a0c2e4f6",
      ack: "112510004321",
      ackDate: "13-Apr-2025",
      ewb: "EWB-2025-98765",
    },

    parties: {
      supplier: {
        name: "Acme Technologies Pvt. Ltd.",
        gstin: "33AABCA1234B1ZP",
        address: "42, Gandhipuram, Avinashi Road Coimbatore — 641018 Tamil Nadu, India",
        phone: "+91 98765 43210"
      },
      buyer: {
        name: "Global Exports Ltd.",
        gstin: "27AABCG5678C1ZQ",
        address: "101, Industrial Estate, Andheri East Mumbai — 400069 Maharashtra, India",
        phone: "+91 91234 56789"
      },
    },

    items: [
      {
        desc: "Software Service",
        hsn: "998314",
        qty: 2,
        unit: "NOS",
        rate: 1000,
        disc: 0,
        taxable: 2000,
        gst: 18,
        cgst: 10,
        igst: 360,
        sgst: 9,
        cess: 10,
        total: 2360,
      },
    ],

    taxSummary: [
      { label: "Taxable amount", value: 2000 },
      { label: "Round off", value: 2000 },
      { label: " totalIgst", value: 100 },
      { label: "totalCgst", value: 16 },
      { label: "totalSgst", value: 29 },
      { label: "totalCess", value: 15 },
    ],



    words: "Two thousand three hundred and sixty Rupees Only",

    bank: {
      bankName: "HDFC Bank Ltd.",
      accountNumber: "00123456789",
      ifsc: "HDFC0001234",
      paymentTerms: "Net 30 Days",
      dispatchFrom: "Coimbatore Warehouse",
      transportMode: "Road — LORRY",
    },


  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">

      {/* Topbar */}
      <div className="flex justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-[18px] font-medium text-foreground dark:text-gray-200">E-Invoice viewer</h2>

        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-accent/20 text-accent border border-accent/30">
            IRN Generated
          </Badge>

          <Badge className="bg-primary/20 text-primary border border-primary/30">
            GSTN Compliant
          </Badge>

          <Button variant="outline" size="sm">
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Card */}
      <div
        ref={invoiceRef}
        className="border border-border bg-card rounded-xl overflow-hidden shadow-sm"
      >

        {/* HEADER */}
        <div className="bg-primary text-primary-foreground p-6 flex justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-primary-foreground text-[20px] font-medium">
              {invoiceData.company.name}
            </h1>
            <p className="text-primary-foreground/70 text-[11px]">
              {invoiceData.company.address}
            </p>
            <p className="text-[#85B7EB] text-[11px] mt-1">
              {invoiceData.company.gstin}
            </p>
            <Badge className="mt-2 bg-white/20 text-white border border-white/30 text-[10px]">
              Tax Invoice · B2B
            </Badge>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-primary-foreground/70">
              Invoice number
            </p>
            <h2 className="text-primary-foreground text-[22px] font-semibold">
              {invoiceData.invoice.number}
            </h2>

            <div className="flex gap-4 mt-2 justify-end flex-wrap text-[11px] text-primary-foreground/70">

              <div>
                <span>Invoice date</span>
                <span className="block text-primary-foreground font-medium">
                  {invoiceData.invoice.date}
                </span>
              </div>

              <div>
                <span>Due date</span>
                <span className="block text-primary-foreground font-medium">
                  {invoiceData.invoice.dueDate}
                </span>
              </div>

              <div>
                <span>Place of supply</span>
                <span className="block text-primary-foreground font-medium">
                  {invoiceData.invoice.place}
                </span>
              </div>

              <Badge className="bg-primary/20 text-primary border border-primary/30">
                GSTN Compliant
              </Badge>

              <Button variant="outline" size="sm">
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6">

        {/* IRN */}
        <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg mb-5">
          <p className="text-[10px] uppercase text-accent font-medium">
            Invoice Reference Number (IRN)
          </p>
          <p className="text-[11px] font-mono text-foreground break-all">
            {invoiceData.irn.number}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Ack No: {invoiceData.irn?.ack} · {invoiceData.irn?.ackDate} · {invoiceData.irn?.ewb}
          </p>
        </div>

        {/* PARTIES */}
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="bg-secondary/50border border-gray-200 dark:border-gray-700 p-4 rounded">
            <p className="text-[10px] text-muted-foreground uppercase">
              Billed from (Supplier)
            </p>
            <p className="font-medium">
              {invoiceData.parties.supplier.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {invoiceData.parties.supplier.gstin}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {invoiceData.parties.supplier.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {invoiceData.parties.supplier.phone}
            </p>
          </div>

          <div className="bg-secondary/50border border-gray-200 dark:border-gray-700 p-4 rounded">
            <p className="text-[10px] text-muted-foreground uppercase">
              Billed to (Buyer)
            </p>
            <p className="font-medium">
              {invoiceData.parties.buyer.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {invoiceData.parties.buyer.gstin}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {invoiceData.parties.buyer.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {invoiceData.parties.buyer.phone}
            </p>
          </div>
        </div>

        {/* TABLE FULL */}
        <div className="mb-5 overflow-x-auto">
          <p className="text-[10px] uppercase text-foreground dark:text-gray-200 border-b pb-2 mb-3">
            Line items
          </p>

          <table className="w-full text-[12px] border">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">HSN</th>
                <th className="p-2 border text-right">Qty</th>
                <th className="p-2 border">Unit</th>
                <th className="p-2 border text-right">Rate</th>
                <th className="p-2 border text-right">Disc%</th>
                <th className="p-2 border text-right">Taxable</th>
                <th className="p-2 border text-right">GST%</th>
                <th className="p-2 border text-right">CGST%</th>
                <th className="p-2 border text-right">IGST</th>
                <th className="p-2 border text-right">SGST</th>
                <th className="p-2 border text-right">CESS</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 text-center border border-border text-foreground">
                    {index + 1}
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.desc}
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.hsn}
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.qty}
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.unit}
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    ₹{item.rate}
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.disc}%
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    ₹{item.taxable}
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.gst}%
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.cgst}%
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.igst}%
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.sgst}%
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    {item.cess}%
                  </td>

                  <td className="p-2 text-center border border-border text-foreground">
                    ₹{item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TAX SUMMARY */}
        <div className="ml-auto gap-2 mb-5">
          <div className="bg-secondary/50 border border-border p-3 rounded flex flex-col gap-2">
            {invoiceData.taxSummary.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.label}</span>
                <span>₹{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Amount in Words */}
        <div className="bg-secondary/50p-3 rounded mb-5">
          Amount in words:{" "}
          <span className="font-medium">
            {invoiceData.words}
          </span>
        </div>

        {/* Payment & Bank Details */}
        <div className="mb-5">
          <p className="text-[10px] uppercase text-muted-foreground border-b pb-2 mb-3">
            Payment & bank details
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-secondary/50 border border-border p-3 rounded">
              <p className="text-[10px] text-muted-foreground">Bank name</p>
              <p className="text-[12px] font-medium">{invoiceData.bank.bankName}</p>
            </div>

            <div className="bg-secondary/50 border border-border p-3 rounded">
              <p className="text-[10px] text-muted-foreground">Account number</p>
              <p className="text-[12px] font-medium">{invoiceData.bank.accountNumber}</p>
            </div>

            <div className="bg-secondary/50 border border-border p-3 rounded">
              <p className="text-[10px] text-muted-foreground">IFSC code</p>
              <p className="text-[12px] font-medium">{invoiceData.bank.ifsc}</p>
            </div>

            <div className="bg-secondary/50 border border-border p-3 rounded">
              <p className="text-[10px] text-muted-foreground">Payment terms</p>
              <p className="text-[12px] font-medium">{invoiceData.bank.paymentTerms}</p>
            </div>

            <div className="bg-secondary/50 border border-border p-3 rounded">
              <p className="text-[10px] text-muted-foreground">Dispatch from</p>
              <p className="text-[12px] font-medium">
                {invoiceData.bank.dispatchFrom}
              </p>
            </div>

            <div className="bg-secondary/50 border border-border p-3 rounded">
              <p className="text-[10px] text-muted-foreground">Transport mode</p>
              <p className="text-[12px] font-medium">{invoiceData.bank.transportMode}</p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mb-5">
          <p className="text-[10px] uppercase text-muted-foreground border-b pb-2 mb-3">
            Terms & conditions
          </p>

          <div className="bg-secondary/50p-3 rounded text-xs">
            Subject to Coimbatore jurisdiction. Goods once sold will not be taken back.
            Payment within 30 days from invoice date. Interest @ 18% p.a. applicable on
            delayed payments. E&OE.
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="bg-secondary/30 border-t border-border pt-10 px-4 pb-2 flex justify-between text-xs text-muted-foreground">
        <p className="text-[9px]">This is a computer-generated e-invoice. No physical signature required.
          Verified by Goods and Services Tax Network (GSTN), Government of India.</p>
        <p className="text-[9px]">Authorised Signatory — Acme Technologies Pvt. Ltd.</p>
      </div>

    </div>
  );
};

export default Invoice;