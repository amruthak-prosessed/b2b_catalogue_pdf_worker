export function generateSupplierHeader(
  brand: string,
  supplierLogoUrl: string,
  productCount: number
) {
  const safeBrand = brand
    .replace(/\s+/g, "-")
    .toLowerCase();

  return `

<div class="supplierHeader">

  <div class="supplierLeft">

    ${
      supplierLogoUrl
        ? `
        <img
          src="${supplierLogoUrl}"
          class="supplierHeaderLogo"
        />
        `
        : ""
    }

    <h1>${brand}</h1>

  </div>

  <div class="supplierNavigation">

    <a href="#cover">
      ↑ Go to Top
    </a>

    <a href="#supplier-${safeBrand}">
      ← Supplier
    </a>

  </div>

</div>

`;

}