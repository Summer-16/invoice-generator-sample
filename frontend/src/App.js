import { useState, useEffect } from "react";
import axios from 'axios';
import "./App.css"
import {
  AppBar, Box, Toolbar, Typography, Grid, Card, CardContent, Button,
  TextField, CardHeader, InputLabel, MenuItem, FormControl, Select
} from '@mui/material';

const baseUrl = "http://localhost:2000/";

// Added some default value to save input time while testing
const defaultForm = {
  billToName: "DEPO SOLUTIONS PRIVATE LIMITED",
  billToAddress: "77/1/A, Christopher Road, Topsia\nTopsia\nKolkata - 700046\nWest Bengal",
  billToGSTIN: "19AAJCD1058P1Z4",
  shipToName: "DEPO SOLUTIONS PRIVATE LIMITED",
  shipToAddress: "77/1/A, Christopher Road, Topsia\nTopsia\nKolkata - 700046\nWest Bengal",
  shipToGSTIN: "19AAJCD1058P1Z4"
}

let counter = 0;

function App() {

  const [form, setForm] = useState(defaultForm);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productLookup, setProductLookup] = useState([]);
  const [config, setConfig] = useState({});

  useEffect(() => {
    axios({
      method: 'get',
      url: baseUrl + 'products',
    })
      .then(function (response) {
        if (response.data.success) {
          setProductLookup(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  const handleAdd = () => {
    const localConfig = { ...config };
    localConfig[counter] = "";
    counter++;
    setConfig(localConfig);
  }

  const handleDelete = (key) => {
    const localConfig = { ...config };
    delete localConfig[key];
    setConfig(localConfig);

    const selectedProductsL = [...selectedProducts];
    const index = selectedProductsL.indexOf(config[key]._id);
    if (index > -1) {
      selectedProductsL.splice(index, 1);
    }
    setSelectedProducts(selectedProductsL);
  }

  const onSelectChange = (e, key) => {
    const value = e.target.value;

    let productDetail = productLookup.filter(item => item._id === value);
    productDetail = productDetail[0];

    const selectedProductsL = [...selectedProducts];
    selectedProductsL.push(value);
    setSelectedProducts(selectedProductsL);

    const localConfig = { ...config };
    localConfig[key] = productDetail;
    setConfig(localConfig);

  }

  const handleSubmit = () => {

    const payload = {
      "billTo": {
        "name": form.billToName,
        "address": form.billToAddress,
        "gstin": form.billToGSTIN,
      },
      "shipTo": {
        "name": form.shipToName,
        "address": form.shipToAddress,
        "gstin": form.shipToGSTIN,
      },
      "productList": selectedProducts
    }

    axios({
      method: 'post',
      url: baseUrl + 'genInvoice',
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
      },
      data: payload
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Invoice.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Invoice Generator Sample
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} className="grid-container">
        <Grid item md={6} className="input-container">
          <Card>
            <CardHeader className="pb-0" title="Bill To" />
            <CardContent className="pt-0">
              <TextField
                className="mt-1"
                label="Name"
                name="billToName"
                fullWidth
                value={form.billToName}
                onChange={handleChange} />
              <TextField
                className="mt-1"
                label="Address"
                name="billToAddress"
                fullWidth
                multiline
                rows={4}
                value={form.billToAddress}
                onChange={handleChange} />
              <TextField
                className="mt-1"
                label="GSTIN"
                name="billToGSTIN"
                fullWidth
                value={form.billToGSTIN}
                onChange={handleChange} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} className="input-container">
          <Card>
            <CardHeader className="pb-0" title="Ship To" />
            <CardContent className="pt-0">
              <TextField
                className="mt-1"
                label="Name"
                name="shipToName"
                fullWidth
                value={form.shipToName}
                onChange={handleChange} />
              <TextField
                className="mt-1"
                label="Address"
                name="shipToAddress"
                fullWidth
                multiline
                rows={4}
                value={form.shipToAddress}
                onChange={handleChange} />
              <TextField
                className="mt-1"
                label="GSTIN"
                name="shipToGSTIN"
                fullWidth
                value={form.shipToGSTIN}
                onChange={handleChange} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={12}>
          <Card>
            <CardHeader
              title="Selects Products for Invoice"
              subheader="Choose products and click submit to generate invoice" />
            <CardContent>
              <Grid container spacing={2} className="grid-container">
                <Grid item md={6}>
                  <Typography variant="h6" component="div">
                    Product
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography align="center" variant="h6" component="div">
                    Price
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography align="center" variant="h6" component="div">
                    Discount
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography align="center" variant="h6" component="div">
                    Remove
                  </Typography>
                </Grid>
                {Object.keys(config).map((key) => {
                  return <>
                    <Grid item md={6}>
                      {config[key]._id ?
                        <Typography align="left" variant="h6" component="div">
                          {config[key].description || "-"}
                        </Typography>
                        : <FormControl fullWidth>
                          <InputLabel id={"label" + key}>Product List</InputLabel>
                          <Select
                            labelId={"label" + key}
                            label="Product List"
                            value={config[key]._id || ""}
                            onChange={(e) => onSelectChange(e, key)}>
                            {productLookup.map((product) => {
                              console.log(selectedProducts, product)
                              if (selectedProducts.includes(product._id))
                                return ""
                              else
                                return <MenuItem value={product._id}>{product.description}</MenuItem>
                            })}
                          </Select>
                        </FormControl>}
                    </Grid>
                    <Grid item md={2}>
                      <Typography align="center" variant="h6" component="div">
                        {config[key].amount || "-"}
                      </Typography>
                    </Grid>
                    <Grid item md={2}>
                      <Typography align="center" variant="h6" component="div">
                        {config[key].discount || "-"}
                      </Typography>
                    </Grid>
                    <Grid item md={2}>
                      <Typography align="center" variant="h6" component="div">
                        <Button size="small" color="error" variant="contained" onClick={() => handleDelete(key)}>Delete</Button>
                      </Typography>
                    </Grid>
                  </>
                })}
                <Grid className="mt-2" item md={6}>
                  <Button size="small" variant="contained" onClick={handleAdd}>Add Product +</Button>
                </Grid>
                <Grid className="mt-2" item md={6}>
                  <Button disabled={!selectedProducts.length} className="float-right" size="small" color="success" variant="contained" onClick={handleSubmit}>Generate Invoice</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box >
  );
}

export default App;
