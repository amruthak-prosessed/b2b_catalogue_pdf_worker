import { generateFooter } from "./components/Footer";
import { generateSupplierHeader } from "./components/SupplierHeader";

export function generateSupplierPage(
    catalog,
    brand,
    products,
    supplierLogos,
    firstCategoryHtml:string
) {

  const supplierLogo = supplierLogos.find(
    (s: any) => s.brand === brand
  );

  const supplierLogoUrl = supplierLogo
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${supplierLogo.asset_path}`
    : "";

  const categories = [
    ...new Set(
      products.map(
        (p: any) => p.products.category
      )
    )
  ];

  return `

<div
class="page"
id="supplier-${brand.replace(/\s+/g, "-").toLowerCase()}"
>

<div class="pageContent">

${generateSupplierHeader(
  brand,
  supplierLogoUrl,
  products.length
)}

<h2 class="subTitle">

SUB-CATEGORIES

</h2>

<div class="subCategories">

${categories.map(category => `

<a
href="#category-${brand
    .replace(/\s+/g,"-")
    .toLowerCase()}-${category
    .replace(/\s+/g,"-")
    .toLowerCase()}"
class="categoryChip"
style="
text-decoration:none;
color:inherit;
display:inline-block;
"
>

${category}

</a>

`).join("")}

</div>

${firstCategoryHtml}

</div>

${generateFooter(catalog)}

</div>

`;

}