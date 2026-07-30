import puppeteer from "puppeteer";
import { supabase } from "./index";
import { generateBentoCatalogHTML } from "./templates/bento/bentoTemplate";
import { generateCatalogHTML } from "./templates/classic/classicTemplate";

export async function renderCatalog(
  catalogId: string
) {
  // =========================================================
  // 1. FETCH CATALOG
  // =========================================================

  const { data: catalog, error } =
    await supabase
      .from("catalogs")
      .select(`
        *,
        companies(*),
        catalog_products(
          position,
          products(
            *,
            product_images(*)
          )
        )
      `)
      .eq("id", catalogId)
      .single();

  if (error || !catalog) {
    throw (
      error ??
      new Error("Catalog not found")
    );
  }

  // =========================================================
  // 2. FETCH SUPPLIER LOGOS
  // =========================================================

  const { data: supplierLogos } =
    await supabase
      .from("supplier_logos")
      .select("*")
      .eq(
        "company_id",
        catalog.company_id
      );

  // =========================================================
  // 3. FETCH ASSETS
  // =========================================================

  const { data: assets } =
    await supabase
      .from("assets")
      .select("*")
      .eq(
        "company_id",
        catalog.company_id
      );

  console.log(
    "Generating catalog HTML..."
  );

  // =========================================================
  // 4. GENERATE HTML
  // =========================================================

let html: string;

const theme = catalog.config?.theme ?? "classic";

console.log(
  `Generating catalog with theme: ${theme}`
);

switch (theme) {
  case "bento":
    console.log("Using Bento template");

    html = generateBentoCatalogHTML(
      catalog,
      supplierLogos ?? [],
      assets ?? []
    );
    break;

  case "classic":
  default:
    console.log("Using Classic template");

    html = generateCatalogHTML(
      catalog,
      supplierLogos ?? [],
      assets ?? []
    );
    break;
}

  // =========================================================
  // 5. START BROWSER
  // =========================================================

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page =
      await browser.newPage();

    // =======================================================
    // 6. LOAD HTML
    // =======================================================

    console.log(
      "Loading catalog HTML..."
    );

    await page.setContent(
      html,
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );

    // =======================================================
    // 7. WAIT FOR IMAGES
    //
    // IMPORTANT:
    // Plain JS string.
    // No TS callback passed into evaluate.
    // =======================================================

    console.log(
      "Waiting for images..."
    );

    await page.evaluate(`
      (async () => {

        const images =
          Array.from(
            document.images
          );

        await Promise.all(
          images.map((img) => {

            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise(
              (resolve) => {

                img.addEventListener(
                  "load",
                  resolve,
                  { once: true }
                );

                img.addEventListener(
                  "error",
                  resolve,
                  { once: true }
                );

              }
            );

          })
        );

      })();
    `);

    // =======================================================
    // 8. DYNAMIC HEIGHT-BASED PAGINATION
    //
    // RULE:
    //
    // 4 products = one row.
    //
    // Number of rows per page is NOT fixed.
    //
    // 0 rows may fit.
    // 1 row may fit.
    // 2 rows may fit.
    // 3 rows may fit.
    // etc.
    //
    // Only physical available space decides.
    // =======================================================

    console.log(
      "Starting dynamic pagination..."
    );

    await page.evaluate(`
      (() => {

        const GAP_FROM_FOOTER = 15;

        let pageIndex = 0;

        let safetyCounter = 0;

        const MAX_ITERATIONS = 2000;


        // ---------------------------------------------------
        // CHECK WHETHER ONE COMPLETE ROW FITS
        // ---------------------------------------------------

        const rowFits = (
          row,
          footer
        ) => {

          const rowRect =
            row.getBoundingClientRect();

          const footerRect =
            footer.getBoundingClientRect();

          return (
            rowRect.bottom <=
            footerRect.top -
            GAP_FROM_FOOTER
          );

        };


        // ---------------------------------------------------
        // CREATE CLEAN CONTINUATION PAGE
        // ---------------------------------------------------

        const createContinuationPage = (
          sourcePage,
          categoryHeading
        ) => {

          const continuationPage =
            document.createElement(
              "div"
            );

          continuationPage.className =
            "page categoryPage continuationPage";


          // -----------------------------------------------
          // PAGE CONTENT
          // -----------------------------------------------

          const pageContent =
            document.createElement(
              "div"
            );

          pageContent.className =
            "pageContent";


          // -----------------------------------------------
          // COPY SUPPLIER HEADER
          // -----------------------------------------------

          const supplierHeader =
            sourcePage.querySelector(
              ".supplierHeader"
            );

          if (supplierHeader) {

            const clonedHeader =
              supplierHeader.cloneNode(
                true
              );

            // Remove IDs from clone
            clonedHeader
              .querySelectorAll("[id]")
              .forEach(
                (element) => {
                  element.removeAttribute(
                    "id"
                  );
                }
              );

            pageContent.appendChild(
              clonedHeader
            );

          }


          // -----------------------------------------------
          // COPY SUPPLIER NAVIGATION
          // -----------------------------------------------

          const pageLinks =
            sourcePage.querySelector(
              ".pageLinks"
            );

          if (pageLinks) {

            pageContent.appendChild(
              pageLinks.cloneNode(
                true
              )
            );

          }


          // -----------------------------------------------
          // CATEGORY HEADING
          // -----------------------------------------------

          const heading =
            document.createElement(
              "h2"
            );

          heading.className =
            "categoryHeading";

          heading.textContent =
            categoryHeading;

          pageContent.appendChild(
            heading
          );


          // -----------------------------------------------
          // EMPTY PRODUCT ROW CONTAINER
          // -----------------------------------------------

          const productRows =
            document.createElement(
              "div"
            );

          productRows.className =
            "productRows";

          pageContent.appendChild(
            productRows
          );


          continuationPage.appendChild(
            pageContent
          );


          // -----------------------------------------------
          // COPY FOOTER
          // -----------------------------------------------

          const footer =
            sourcePage.querySelector(
              ".footer"
            );

          if (footer) {

            const clonedFooter =
              footer.cloneNode(
                true
              );

            continuationPage.appendChild(
              clonedFooter
            );

          }


          return continuationPage;

        };


        // =================================================
        // PROCESS EVERY PAGE
        // =================================================

        while (true) {

          safetyCounter++;


          if (
            safetyCounter >
            MAX_ITERATIONS
          ) {

            console.error(
              "Pagination safety limit reached"
            );

            break;

          }


          // -----------------------------------------------
          // Re-read pages every iteration because
          // continuation pages are added dynamically.
          // -----------------------------------------------

          const pages =
            Array.from(
              document.querySelectorAll(
                ".page"
              )
            );


          // -----------------------------------------------
          // FINISHED
          // -----------------------------------------------

          if (
            pageIndex >=
            pages.length
          ) {

            break;

          }


          const currentPage =
            pages[pageIndex];


          const footer =
            currentPage.querySelector(
              ".footer"
            );


          const productRowsContainer =
            currentPage.querySelector(
              ".productRows"
            );


          // -----------------------------------------------
          // PAGE HAS NO PRODUCTS
          // -----------------------------------------------

          if (
            !footer ||
            !productRowsContainer
          ) {

            pageIndex++;

            continue;

          }


          // -----------------------------------------------
          // GET DIRECT PRODUCT ROWS ONLY
          // -----------------------------------------------

          const rows =
            Array.from(
              productRowsContainer
                .children
            )
            .filter(
              (element) =>
                element
                  .classList
                  .contains(
                    "productRow"
                  )
            );


          if (
            rows.length === 0
          ) {

            pageIndex++;

            continue;

          }


          // -----------------------------------------------
          // FIND FIRST ROW THAT DOES NOT FIT
          //
          // firstOverflowIndex CAN BE 0.
          //
          // That means ZERO rows fit.
          // This is valid.
          // -----------------------------------------------

          let firstOverflowIndex =
            -1;


          for (
            let i = 0;
            i < rows.length;
            i++
          ) {

            if (
              !rowFits(
                rows[i],
                footer
              )
            ) {

              firstOverflowIndex =
                i;

              break;

            }

          }


          // -----------------------------------------------
          // ALL ROWS FIT
          // -----------------------------------------------

          if (
            firstOverflowIndex ===
            -1
          ) {

            pageIndex++;

            continue;

          }


          console.log(
            "Overflow on page " +
            (pageIndex + 1) +
            " starting at row " +
            firstOverflowIndex
          );


          // -----------------------------------------------
          // CATEGORY NAME
          // -----------------------------------------------

          const headingElement =
            currentPage.querySelector(
              ".categoryHeading"
            );


          const categoryHeading =
            headingElement
              ? headingElement
                  .textContent
                  .trim()
              : "";


          // -----------------------------------------------
          // CREATE CONTINUATION
          // -----------------------------------------------

          const continuationPage =
            createContinuationPage(
              currentPage,
              categoryHeading
            );


          // -----------------------------------------------
          // INSERT INTO DOM FIRST
          // -----------------------------------------------

          currentPage
            .insertAdjacentElement(
              "afterend",
              continuationPage
            );


          const continuationRows =
            continuationPage
              .querySelector(
                ".productRows"
              );


          // -----------------------------------------------
          // MOVE ALL OVERFLOWING COMPLETE ROWS
          // -----------------------------------------------

          const overflowingRows =
            rows.slice(
              firstOverflowIndex
            );


          overflowingRows.forEach(
            (row) => {

              continuationRows
                .appendChild(
                  row
                );

            }
          );


          // -----------------------------------------------
          // IMPORTANT
          //
          // Move to continuation page.
          //
          // It will be checked on next iteration.
          //
          // If:
          //
          // 0 rows fit -> all move again
          // 1 row fits -> rest move
          // 2 rows fit -> rest move
          //
          // No hardcoded row limit.
          // -----------------------------------------------

          pageIndex++;

        }


        console.log(
          "Dynamic pagination complete"
        );

      })();
    `);

    // =======================================================
    // 9. REMOVE EMPTY CATEGORY PRODUCT AREAS
    //
    // If ZERO rows fit on supplier page,
    // the heading may remain but products moved.
    //
    // We keep the heading for now.
    // =======================================================


    // =======================================================
    // 10. ASSIGN ACTUAL PAGE NUMBERS
    //
    // Again: raw JS string.
    // =======================================================

    console.log(
      "Assigning page numbers..."
    );

    await page.evaluate(`
      (() => {

        const pages =
          Array.from(
            document.querySelectorAll(
              ".page"
            )
          );


        const totalPages =
          pages.length;


        pages.forEach(
          (
            catalogPage,
            index
          ) => {

            const footerRight =
              catalogPage
                .querySelector(
                  ".footerRight"
                );


            if (
              footerRight
            ) {

              footerRight.textContent =
                "Page " +
                (index + 1) +
                " of " +
                totalPages;

            }

          }
        );

      })();
    `);

    // =======================================================
    // 11. GENERATE PDF
    // =======================================================

    // =======================================================
// 11. GENERATE PDF BUFFER
// =======================================================

console.log(
  "Generating PDF..."
);

const pdfBuffer =
  await page.pdf({
    format: "A4",
    printBackground: true,
  });


// =======================================================
// 12. GET FINAL PAGE COUNT
// =======================================================

const pageCount =
  await page.$$eval(
    ".page",
    (pages) => pages.length
  );


console.log(
  `PDF generated with ${pageCount} pages`
);


// =======================================================
// 13. UPLOAD PDF TO SUPABASE STORAGE
// =======================================================

console.log(
  "Uploading PDF to Supabase..."
);

const pdfPath =
  `${catalog.company_id}/${catalogId}/catalog.pdf`;


const { data: uploadData, error: uploadError } =
  await supabase.storage
    .from("catalogs")
    .upload(
      pdfPath,
      pdfBuffer,
      {
        contentType: "application/pdf",
        upsert: true,
      }
    );

if (uploadError) {
  console.error("UPLOAD ERROR:", uploadError);
  throw new Error(
    `PDF upload failed: ${uploadError.message}`
  );
}

console.log(
  "PDF uploaded successfully:",
  uploadData
);

// =======================================================
// 14. UPDATE CATALOG
// =======================================================

const { error: updateError } =
  await supabase
    .from("catalogs")
    .update({
      pdf_url: uploadData.path,
      page_count: pageCount,
    })
    .eq(
      "id",
      catalogId
    );


if (updateError) {

  throw new Error(
    `Catalog update failed: ${updateError.message}`
  );

}


console.log(
  "Catalog updated successfully"
);

console.log(
  "PDF generation completed"
);

  } finally {

    await browser.close();

  }
}