const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, res) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  doc.end();
  doc.pipe(res);
}

function generateHeader(doc) {
  doc
    .strokeColor("#aaaaaa")
    .rect(50, 50, 500, 750)
    .stroke()
    .image("logo.png", 55, 90, { width: 110 })
    .fillColor("#444444")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Depo Solutions Private Limited", 180, 80, { weight: 500 })
    .font("Helvetica")
    .fontSize(8)
    .text("77/1/A, Christopher Road, Topsia\nKolkata - 700046\nWest Bengal\nGSTIN: 19AAJCD1058P1Z4", 180, 100)
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("Proforma Invoice", 200, 160, { align: "right", })
    .moveDown();

  generateHr(doc, 185);
}

function generateCustomerInformation(doc, invoice) {

  const y1 = 185;
  let yAxis = 190;

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("#", 55, yAxis)
    .font("Helvetica-Bold")
    .text(`: DEPO/KOL/PI/${invoice.invoiceNo}`, 150, yAxis)
    .font("Helvetica")
    .fontSize(10)
    .text("Estimate Date", 55, yAxis + 15)
    .font("Helvetica-Bold")
    .text(`: ${formatDate(new Date())}`, 150, yAxis + 15)
    .font("Helvetica")
    .fontSize(10)
    .text("Place Of Supply", 305, yAxis)
    .font("Helvetica-Bold")
    .text(`: West Bengal (19)`, 405, yAxis)
    .moveDown();

  generateHr(doc, yAxis + 35);
  yAxis = yAxis + 40;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Bill To", 55, yAxis)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Ship To", 305, yAxis)
    .moveDown();

  generateHr(doc, yAxis + 15);
  yAxis = yAxis + 20;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(invoice.billTo.name, 55, yAxis)
    .font("Helvetica")
    .fontSize(10)
    .text(invoice.billTo.address, 55, yAxis + 15)
    .text(`GSTIN: ${invoice.billTo.gstin}`, 55, yAxis + 65)
    .font("Helvetica")
    .fontSize(10)
    .text(invoice.shipTo.name, 305, yAxis)
    .font("Helvetica")
    .fontSize(10)
    .text(invoice.billTo.address, 305, yAxis + 15)
    .text(`GSTIN: ${invoice.shipTo.gstin}`, 305, yAxis + 65)

  generateHr(doc, yAxis + 80);
  const y2 = yAxis + 80;
  generateVr(doc, 300, y1, y2)
}

function generateInvoiceTable(doc, invoice) {
  let yAxis = 335;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("CGST", 378, yAxis)
    .text("SGST", 447, yAxis)

  yAxis = yAxis + 15;

  generateVr(doc, 68, 330, yAxis + 15)
  generateVr(doc, 198, 330, yAxis + 15)
  generateVr(doc, 248, 330, yAxis + 15)
  generateVr(doc, 278, 330, yAxis + 15)
  generateVr(doc, 308, 330, yAxis + 15)
  generateVr(doc, 358, 330, yAxis + 15)
  generateVr(doc, 428, 330, yAxis + 15)
  generateVr(doc, 498, 330, yAxis + 15)
  generateVr(doc, 388, yAxis - 2, yAxis + 15)
  generateVr(doc, 458, yAxis - 2, yAxis + 15)

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(358, yAxis - 2)
    .lineTo(498, yAxis - 2)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("#", 55, yAxis)
    .text("Items & Description", 70, yAxis)
    .text("HSN/SAC", 200, yAxis)
    .text("Qty", 250, yAxis, { width: 25, align: "right" })
    .text("Rate", 280, yAxis, { width: 25, align: "right" })
    .text("Discount", 310, yAxis, { width: 45, align: "right" })
    .text("%", 360, yAxis, { width: 25, align: "right" })
    .text("Amt", 390, yAxis, { width: 35, align: "right" })
    .text("%", 430, yAxis, { width: 25, align: "right" })
    .text("Amt", 460, yAxis, { width: 35, align: "right" })
    .text("Amount", 500, yAxis, { align: "right" })

  generateHr(doc, yAxis + 15);
  doc.font("Helvetica");

  yAxis = yAxis + 15;
  const columns = [
    { key: "sNo", xAxis: 48, vL: false, width: 10, align: 'center' },
    { key: "description", xAxis: 68, vL: true, width: 125, align: 'left' },
    { key: "hsn", xAxis: 198, vL: true, width: 45, align: 'left' },
    { key: "qty", type: 'number', unit: " Pcs", xAxis: 248, vL: true, width: 25, align: 'right' },
    { key: "rate", type: 'number', xAxis: 278, vL: true, width: 24, align: 'right' },
    { key: "discount", type: 'number', unit: "%", xAxis: 308, vL: true, width: 45, align: 'right' },
    { key: "cgstPer", type: 'number', unit: "%", xAxis: 358, vL: true, width: 25, align: 'right' },
    { key: "cgstAmt", type: 'number', xAxis: 388, vL: true, width: 35, align: 'right' },
    { key: "sgstPer", type: 'number', unit: "%", xAxis: 428, vL: true, width: 25, align: 'right' },
    { key: "sgstAmt", type: 'number', xAxis: 458, vL: true, width: 35, align: 'right' },
    { key: "amount", type: 'number', xAxis: 498, vL: true, width: 45, align: 'right' }
  ]

  for (let i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];

    for (const column of columns) {
      doc
        .fontSize(8)
        .text(
          (column.type === 'number' ? Number(item[column.key]).toFixed(2) : item[column.key]) + (column.unit || ''),
          column.xAxis + 2,
          yAxis + 5,
          { width: column.width, align: column.align }
        )
      if (column.vL) {
        generateVr(doc, column.xAxis, yAxis, yAxis + 40)
      }
    }
    yAxis = yAxis + 40
    generateHr(doc, yAxis);

  }

  yAxis = yAxis + 10;

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Total In Words", 55, yAxis)
    .font("Helvetica-Bold")
    .text(numToWord(Number(invoice.total).toFixed(2)), 55, yAxis + 15, { width: 260, align: "left" })
    .font("Helvetica")
    .fontSize(10)
    .text("Looking forward for your business.", 55, yAxis + 50)

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Sub Total", 300, yAxis, { width: 150, align: 'right' })
    .text(numberWithCommas(Number(invoice.subTotal).toFixed(2)), 500, yAxis, { align: 'right' })
    .text("CGST9 (9%)", 300, yAxis + 15, { width: 150, align: 'right' })
    .text(numberWithCommas(Number(invoice.cgstTotal).toFixed(2)), 500, yAxis + 15, { align: 'right' })
    .text("SGST9 (9%)", 300, yAxis + 30, { width: 150, align: 'right' })
    .text(numberWithCommas(Number(invoice.sgstTotal).toFixed(2)), 500, yAxis + 30, { align: 'right' })
    .font("Helvetica-Bold")
    .text("Total", 300, yAxis + 45, { width: 150, align: 'right' })
    .text(numberWithCommas(Number(invoice.total).toFixed(2)), 500, yAxis + 45, { align: 'right' })
    .text("Authorized Signature", 410, yAxis + 100)

  generateVr(doc, 358, yAxis - 15, yAxis + 110)
  generateVr(doc, 458, yAxis - 15, yAxis + 60)
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(358, yAxis + 60)
    .lineTo(550, yAxis + 60)
    .stroke()
    .moveTo(358, yAxis + 110)
    .lineTo(550, yAxis + 110)
    .stroke();
}


function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function generateVr(doc, x, y1, y2) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(x, y1)
    .lineTo(x, y2)
    .stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

function numToWord(amount) {
  const num = (amount + '').split(".");
  return "Indian Rupees " + price_in_words(Number(num[0])) + " and " + price_in_words(Number(num[1])) + " Paise Only";
}

function price_in_words(num) {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const double = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  let res = "";

  if (isNaN(num) || num.toString().length > 10) return res;

  num = num.toString();
  const len = num.length;

  for (let i = 0; i < len; i++) {
    let digit = num[len - i - 1];
    let next = i < len - 1 ? num[len - i - 2] : 0;

    switch (i) {
      case 0:
        res = words[digit] + res;
        break;
      case 1:
        if (digit == 1) res = double[next] + res;
        else if (digit) res = tens[digit] + " " + res;
        break;
      case 2:
        if (digit) res = words[digit] + " Hundred " + res;
        break;
      case 3:
        if (digit) res = words[digit] + " Thousand " + res;
        break;
      case 4:
        if (digit == 1) res = double[next] + " Thousand " + res;
        else if (digit) res = tens[digit] + " " + res + " Thousand ";
        break;
      case 5:
        if (digit) res = words[digit] + " Lakh " + res;
        break;
      case 6:
        if (digit == 1) res = double[next] + " Lakh " + res;
        else if (digit) res = tens[digit] + " " + res + " Lakh ";
        break;
      case 7:
        if (digit) res = words[digit] + " Crore " + res;
        break;
      case 8:
        if (digit == 1) res = double[next] + " Crore " + res;
        else if (digit) res = tens[digit] + " " + res + " Crore ";
        break;
      case 9:
        if (digit) res = words[digit] + " Hundred " + res + " Crore";
        break;
    }
  }

  return res;
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
  createInvoice
};
