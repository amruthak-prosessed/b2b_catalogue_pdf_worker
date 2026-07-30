import { generateFooter } from "../components/Footer";

type CategoryGroup = {
  name: string;
  products: any[];
};

/* =========================================================
   HELPERS
========================================================= */

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* =========================================================
   GROUP PRODUCTS BY CATEGORY
========================================================= */

function groupProductsByCategory(
  products: any[]
): CategoryGroup[] {
  const categoryMap = new Map<
    string,
    any[]
  >();

  products.forEach((cp: any) => {
    const category =
      cp?.products?.category?.trim() ||
      cp?.products?.subcategory?.trim() ||
      cp?.products?.sub_category?.trim() ||
      "Other";

    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }

    categoryMap
      .get(category)!
      .push(cp);
  });

  return Array.from(
    categoryMap.entries()
  ).map(
    ([name, categoryProducts]) => ({
      name,
      products: categoryProducts,
    })
  );
}

/* =========================================================
   MAXIMUM 14 CATEGORIES PER PAGE
========================================================= */

function splitCategories(
  categories: CategoryGroup[]
) {
  const pages: CategoryGroup[][] = [];

  const categoriesPerPage = 14;

  for (
    let index = 0;
    index < categories.length;
    index += categoriesPerPage
  ) {
    pages.push(
      categories.slice(
        index,
        index + categoriesPerPage
      )
    );
  }

  return pages;
}

/* =========================================================
   CATEGORY NAVIGATION CARD
========================================================= */

function renderCategoryCard(
  brand: string,
  category: CategoryGroup,
  index: number
) {
  const safeBrand = slugify(brand);

  const safeCategory =
    slugify(category.name);

  const count =
    category.products.length;

  /*
    Different accent class for each card.
    CSS controls actual colours.
  */

  const colorIndex =
    (index % 7) + 1;

  return `
    <a
      href="#category-${safeBrand}-${safeCategory}"
      class="
        bentoCategoryCard
        categoryColor${colorIndex}
      "
    >

      <div class="bentoCategoryDecor"></div>

      <div class="bentoCategoryNumber">
        ${String(index + 1).padStart(
          2,
          "0"
        )}
      </div>

      <div class="bentoCategoryCardContent">

        <h3 class="bentoCategoryName">
          ${category.name}
        </h3>

        <div class="bentoCategoryMeta">

          <span>
            ${count}
            ${
              count === 1
                ? "Product"
                : "Products"
            }
          </span>

          <span
            class="bentoCategoryArrow"
          >
            →
          </span>

        </div>

      </div>

    </a>
  `;
}

/* =========================================================
   MAIN SUPPLIER PAGE
========================================================= */

export function generateBentoSupplierPage(
  catalog: any,
  brand: string,
  products: any[],
  supplierLogos: any[]
): string {

  const safeBrand =
    slugify(brand);

  /* ---------------------------------------------------------
     SUPPLIER LOGO
  --------------------------------------------------------- */

  const supplierLogo =
    supplierLogos.find(
      (supplier: any) =>
        supplier.brand
          ?.trim()
          .toLowerCase() ===
        brand
          .trim()
          .toLowerCase()
    );

  const supplierLogoUrl =
    supplierLogo?.asset_path
      ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${supplierLogo.asset_path}`
      : "";

  /* ---------------------------------------------------------
     GROUP PRODUCTS
  --------------------------------------------------------- */

  const categoryGroups =
    groupProductsByCategory(products);

  /* ---------------------------------------------------------
     14 CATEGORIES MAXIMUM PER PAGE
  --------------------------------------------------------- */

  const categoryPages =
    splitCategories(categoryGroups);

  /* ---------------------------------------------------------
     GENERATE PAGES
  --------------------------------------------------------- */

  return categoryPages
    .map(
      (
        pageCategories,
        pageIndex
      ) => {

        const categoryOffset =
          pageIndex * 14;

        /*
          Allows CSS to make layouts
          more compact depending on count.
        */

        const categoryCount =
          pageCategories.length;

        let densityClass =
          "categoryGridNormal";

        if (categoryCount >= 11) {
          densityClass =
            "categoryGridDense";
        } else if (
          categoryCount >= 7
        ) {
          densityClass =
            "categoryGridMedium";
        }

        return `
          <section
            class="
              page
              bentoSupplierPage
            "
            ${
              pageIndex === 0
                ? `id="supplier-${safeBrand}"`
                : ""
            }
          >

            <div class="pageContent">

              <!-- ===============================
                   SUPPLIER HEADER
              ================================ -->

              <div
                class="bentoSupplierHeader"
              >

                <div
                  class="bentoSupplierIdentity"
                >

                  ${
                    supplierLogoUrl
                      ? `
                        <img
                          src="${supplierLogoUrl}"
                          class="bentoSupplierHeroLogo"
                        />
                      `
                      : `
                        <div
                          class="bentoSupplierHeroPlaceholder"
                        >
                          ${brand
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      `
                  }

                  <div>

                    <div
                      class="bentoSupplierEyebrow"
                    >
                      SUPPLIER COLLECTION
                    </div>

                    <h1>
                      ${brand}
                    </h1>

                    <p>

                      ${
                        pageIndex === 0
                          ? `
                            ${products.length}
                            ${
                              products.length === 1
                                ? "Product"
                                : "Products"
                            }

                            across

                            ${categoryGroups.length}

                            ${
                              categoryGroups.length === 1
                                ? "Category"
                                : "Categories"
                            }
                          `
                          : `
                            Categories continued
                          `
                      }

                    </p>

                  </div>

                </div>

                ${
                  pageIndex === 0
                    ? `
                      <a
                        href="#cover"
                        class="bentoBackLink"
                      >
                        ← go to top
                      </a>
                    `
                    : `
                      <a
                        href="#supplier-${safeBrand}"
                        class="bentoBackLink"
                      >
                        ← First page
                      </a>
                    `
                }

              </div>

              <!-- ===============================
                   CATEGORY NAVIGATION
              ================================ -->

              <div
                class="
                  bentoCategoryIntro
                  ${densityClass}
                "
              >

                <div
                  class="bentoCategoryHeadingRow"
                >

                  <div>

                    <div
                      class="bentoCategoryEyebrow"
                    >
                      DISCOVER COLLECTION
                    </div>

                    <h2>
                      Browse Categories
                    </h2>

                  </div>

                  <div
                    class="bentoCategoryPageCount"
                  >
                    ${
                      categoryGroups.length
                    }
                    Categories
                  </div>

                </div>

                <div
                  class="bentoCategoryGrid"
                >

                  ${pageCategories
                    .map(
                      (
                        category,
                        index
                      ) =>
                        renderCategoryCard(
                          brand,
                          category,
                          categoryOffset +
                            index
                        )
                    )
                    .join("")}

                </div>

              </div>

            </div>

            ${generateFooter(catalog)}

          </section>
        `;
      }
    )
    .join("");
}