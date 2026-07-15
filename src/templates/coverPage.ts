import { generateFooter } from "./components/Footer";

export function generateCoverPage(
  catalog: any,
  supplierLogos: any[],
  logoUrl: string,
  bannerUrl: string,
  backgroundUrl: string
) {

  const productCount =
    catalog.catalog_products.length;

  const categoryCount = new Set(
    catalog.catalog_products.map(
      (p: any) => p.products.category
    )
  ).size;

  /*
   * Get brands ONLY from products
   * present in this catalogue.
   */
  const brandsInCatalog = [
    ...new Set(
      catalog.catalog_products.map(
        (cp: any) => cp.products.brand
      )
    ),
  ] as string[];

  /*
   * Match a logo if available.
   *
   * A supplier is still displayed even
   * when no supplier logo exists.
   */
  const visibleSuppliers =
    brandsInCatalog.map((brand: string) => {

      const supplierLogo =
        supplierLogos.find(
          (supplier: any) =>
            supplier.brand
              ?.trim()
              .toLowerCase() ===
            brand
              ?.trim()
              .toLowerCase()
        );

      return {
        brand,
        asset_path:
          supplierLogo?.asset_path ?? null,
      };

    });

  /*
   * First page has less space because
   * it contains header + banner.
   */
 const FIRST_PAGE_LIMIT = 12;
 const CONTINUATION_PAGE_LIMIT = 15;

  const firstPageSuppliers =
    visibleSuppliers.slice(
      0,
      FIRST_PAGE_LIMIT
    );

  const remainingSuppliers =
    visibleSuppliers.slice(
      FIRST_PAGE_LIMIT
    );

  /*
   * Split remaining suppliers into
   * groups of 12.
   */
  const continuationPages: any[][] = [];

  for (
    let i = 0;
    i < remainingSuppliers.length;
    i += CONTINUATION_PAGE_LIMIT
  ) {

    continuationPages.push(
      remainingSuppliers.slice(
        i,
        i + CONTINUATION_PAGE_LIMIT
      )
    );

  }

  /*
   * Reusable supplier card generator.
   */
  const generateSupplierCards = (
    suppliers: any[]
  ) => {

    return suppliers
      .map((supplier: any) => {

        const supplierId =
          supplier.brand
            .replace(/\s+/g, "-")
            .toLowerCase();

        return `

<a
href="#supplier-${supplierId}"
class="supplierCard"
style="
text-decoration:none;
color:inherit;
"
>

${
supplier.asset_path
? `
<img
class="supplierLogo"
src="${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${supplier.asset_path}"
/>
`
: `
<div class="supplierLogoPlaceholder">

${supplier.brand
  .charAt(0)
  .toUpperCase()}

</div>
`
}

<div class="supplierName">

${supplier.brand}

</div>

</a>

`;

      })
      .join("");

  };

  /*
   * FIRST COVER PAGE
   */
  const firstPage = `

<div
class="page"
id="cover"
>

<div class="pageContent">

<div class="header">

<div class="left">

${
logoUrl
? `
<img
class="companyLogo"
src="${logoUrl}"
/>
`
: ""
}

<div>

<h1>
${catalog.companies.name}
</h1>

<h3>
${catalog.name}
</h3>

<p>
Wholesale Product Catalogue
</p>

</div>

</div>


<div class="right">

<div class="dateBox">

${new Date().toLocaleDateString()}

</div>


<div class="countBox">

${productCount}

<br>

Products

</div>


<div class="countBox">

${categoryCount}

<br>

Categories

</div>

</div>

</div>


${
bannerUrl
? `
<div class="banner">

<img
src="${bannerUrl}"
class="bannerImage"
/>

</div>
`
: ""
}


<div class="section">

<div class="sectionTitle">

MAIN CATEGORIES

</div>

<div class="sectionSubtitle">

Choose a supplier to jump to.

</div>

</div>


<div class="supplierGrid">

${generateSupplierCards(
  firstPageSuppliers
)}

</div>

</div>

${generateFooter(catalog)}

</div>

`;

  /*
   * CONTINUATION COVER PAGES
   */
  const continuationHtml =
    continuationPages
      .map(
        (
          suppliers: any[],
          index: number
        ) => `

<div
class="page"
id="cover-suppliers-${index + 2}"
>

<div class="pageContent">

<div class="section">

<div class="sectionTitle">

MAIN CATEGORIES

</div>

<div class="sectionSubtitle">

Suppliers continued

</div>

</div>


<div class="supplierGrid">

${generateSupplierCards(
  suppliers
)}

</div>

</div>

${generateFooter(catalog)}

</div>

`
      )
      .join("");

  return (
    firstPage +
    continuationHtml
  );
}