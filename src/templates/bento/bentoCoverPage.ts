export function generateBentoCoverPage(
  catalog: any,
  supplierLogos: any[],
  logoUrl: string,
  bannerUrl: string
) {
  const productCount =
    catalog.catalog_products.length;

  const brands = [
    ...new Set(
      catalog.catalog_products.map(
        (cp: any) => cp.products.brand
      )
    ),
  ] as string[];

  const supplierCards = brands
    .map((brand) => {
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

      const supplierLogoUrl =
        supplierLogo
          ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${supplierLogo.asset_path}`
          : "";

      const supplierId = brand
        .replace(/\s+/g, "-")
        .toLowerCase();

      return `
        <a
          href="#supplier-${supplierId}"
          class="bentoSupplierCard"
        >
          ${
            supplierLogoUrl
              ? `
                <img
                  src="${supplierLogoUrl}"
                  class="bentoSupplierLogo"
                />
              `
              : `
                <div class="bentoSupplierPlaceholder">
                  ${brand.charAt(0).toUpperCase()}
                </div>
              `
          }

          <span>${brand}</span>
        </a>
      `;
    })
    .join("");

  return `
    <div class="page bentoCover" id="cover">

      <div class="pageContent">

        <div class="bentoCoverTop">

          <div>
            ${
              logoUrl
                ? `
                  <img
                    src="${logoUrl}"
                    class="bentoCompanyLogo"
                  />
                `
                : ""
            }
          </div>

          <div class="bentoEdition">
            ${catalog.edition ?? ""}
          </div>

        </div>

        <div class="bentoCoverTitle">

          <div class="bentoEyebrow">
            PRODUCT CATALOGUE
          </div>

          <h1>
            ${catalog.name}
          </h1>

          ${
            catalog.description
              ? `
                <p>
                  ${catalog.description}
                </p>
              `
              : ""
          }

        </div>

        ${
          bannerUrl
            ? `
              <div class="bentoHero">
                <img src="${bannerUrl}" />
              </div>
            `
            : ""
        }

        <div class="bentoStats">

          <div>
            <strong>${productCount}</strong>
            <span>Products</span>
          </div>

          <div>
            <strong>${brands.length}</strong>
            <span>Suppliers</span>
          </div>

        </div>

        <div class="bentoSupplierSection">

          <div class="bentoSectionHeading">
            Explore Suppliers
          </div>

          <div class="bentoSupplierGrid">
            ${supplierCards}
          </div>

        </div>

      </div>

      <div class="footer">

        <div class="footerLeft">
          ${catalog.companies.name}
        </div>

        <div class="footerRight"></div>

      </div>

    </div>
  `;
}