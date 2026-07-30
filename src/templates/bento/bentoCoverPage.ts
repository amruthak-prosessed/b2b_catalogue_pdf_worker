import { generateFooter } from "../components/Footer";

export function generateBentoCoverPage(
  catalog: any,
  supplierLogos: any[],
  logoUrl: string,
  bannerUrl: string
) {

  const selectedProducts =
    (catalog.catalog_products ?? [])
      .filter(
        (cp: any) =>
          cp?.products
      );

  const productCount =
    selectedProducts.length;

  const brands = [
    ...new Set(
      selectedProducts
        .map(
          (cp: any) =>
            cp.products?.brand?.trim()
        )
        .filter(Boolean)
    ),
  ] as string[];

  const companyName =
    catalog?.companies?.name ??
    "Product Collection";

  const supplierCards = brands
    .map(
      (
        brand,
        index
      ) => {

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
          supplierLogo?.asset_path
            ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${supplierLogo.asset_path}`
            : "";

        const supplierId =
          brand
            .trim()
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            );

        const colorIndex =
          (index % 5) + 1;

        return `
          <a
            href="#supplier-${supplierId}"
            class="
              bentoSupplierCard
              supplierColor${colorIndex}
            "
          >

            <div
              class="bentoSupplierCardLogo"
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
                    <div
                      class="bentoSupplierPlaceholder"
                    >
                      ${brand
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  `
              }

            </div>

            <div
              class="bentoSupplierCardText"
            >

              <span>
                ${brand}
              </span>

              <small>
                View collection →
              </small>

            </div>

          </a>
        `;
      }
    )
    .join("");

  return `

    <section
      class="page bentoCover"
      id="cover"
    >

      <div class="pageContent">

        <!-- ===============================
             COVER HEADER
        ================================ -->

        <div class="bentoCoverTop">

          <div
            class="bentoCoverCompany"
          >

            ${
              logoUrl
                ? `
                  <div
                    class="bentoCoverLogoWrap"
                  >
                    <img
                      src="${logoUrl}"
                      class="bentoCompanyLogo"
                    />
                  </div>
                `
                : ""
            }

            <div>

              <div
                class="bentoCompanyLabel"
              >
                PRESENTED BY
              </div>

              <div
                class="bentoCompanyName"
              >
                ${companyName}
              </div>

            </div>

          </div>

          ${
            catalog.edition
              ? `
                <div
                  class="bentoEdition"
                >
                  ${catalog.edition}
                </div>
              `
              : ""
          }

        </div>

        <!-- ===============================
             MAIN TITLE
        ================================ -->

        <div class="bentoCoverTitle">

          <div class="bentoEyebrow">
            CURATED PRODUCT COLLECTION
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
              : `
                <p>
                  Explore our complete collection
                  of products and suppliers.
                </p>
              `
          }

        </div>

        <!-- ===============================
             HERO
        ================================ -->

        ${
          bannerUrl
            ? `
              <div class="bentoHero">

                <img
                  src="${bannerUrl}"
                />

                <div
                  class="bentoHeroOverlay"
                ></div>

                <div
                  class="bentoHeroCaption"
                >
                  PRODUCT CATALOGUE
                </div>

              </div>
            `
            : `
              <div
                class="bentoHeroFallback"
              >

                <div
                  class="bentoHeroShape
                         bentoHeroShapeOne"
                ></div>

                <div
                  class="bentoHeroShape
                         bentoHeroShapeTwo"
                ></div>

                <div
                  class="bentoHeroFallbackText"
                >
                  <span>
                    ${companyName}
                  </span>

                  <strong>
                    Discover our collection
                  </strong>
                </div>

              </div>
            `
        }

        <!-- ===============================
             STATS
        ================================ -->

        <div class="bentoStats">

          <div
            class="bentoStatPrimary"
          >

            <strong>
              ${productCount}
            </strong>

            <span>
              Curated Products
            </span>

          </div>

          <div
            class="bentoStatSecondary"
          >

            <strong>
              ${brands.length}
            </strong>

            <span>
              Trusted Suppliers
            </span>

          </div>

        </div>

        <!-- ===============================
             SUPPLIERS
        ================================ -->

        ${
          brands.length > 0
            ? `
              <div
                class="bentoSupplierSection"
              >

                <div
                  class="bentoSupplierSectionHeader"
                >

                  <div>

                    <div
                      class="bentoSupplierSectionEyebrow"
                    >
                      EXPLORE
                    </div>

                    <div
                      class="bentoSectionHeading"
                    >
                      Browse Suppliers
                    </div>

                  </div>

                  <div
                    class="bentoSupplierCount"
                  >
                    ${brands.length}
                    ${
                      brands.length === 1
                        ? "Supplier"
                        : "Suppliers"
                    }
                  </div>

                </div>

                <div
                  class="bentoSupplierGrid"
                >
                  ${supplierCards}
                </div>

              </div>
            `
            : ""
        }

      </div>

      ${generateFooter(catalog)}

    </section>
  `;
}