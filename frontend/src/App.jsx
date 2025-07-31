import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Drawer,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

function App() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const lower = value.toLowerCase();
    const result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower)
    );
    setFiltered(result);
  };

  const openDrawer = (product) => {
    setSelected(product);
  };

  const closeDrawer = () => {
    setSelected(null);
  };

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar
          sx={{
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ShopSmart
          </Typography>
          <TextField
            fullWidth={isMobile}
            size="small"
            placeholder="Search products..."
            variant="outlined"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              maxWidth: isMobile ? "100%" : 300,
            }}
            value={search}
            onChange={handleSearch}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography>No products found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {product.brand}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {product.name.length > 60
                        ? product.name.slice(0, 60) + "..."
                        : product.name}
                    </Typography>
                    <Typography color="text.secondary">
                      ₹{product.retail_price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => openDrawer(product)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Product Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 400,
            maxWidth: "100vw",
          },
        }}
      >
        <Box display="flex" alignItems="center" p={2}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Product Info
          </Typography>
          <IconButton onClick={closeDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {selected && (
          <Box p={3}>
            <Typography variant="h6">{selected.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {selected.brand}
            </Typography>
            <Typography>Category: {selected.category}</Typography>
            <Typography>Department: {selected.department}</Typography>
            <Typography>Retail Price: ₹{selected.retail_price}</Typography>
            <Typography>Cost: ₹{selected.cost.toFixed(2)}</Typography>
            <Typography>SKU: {selected.sku}</Typography>
            <Typography>
              Distribution Center ID: {selected.distribution_center_id}
            </Typography>
          </Box>
        )}
      </Drawer>
    </>
  );
}

export default App;
