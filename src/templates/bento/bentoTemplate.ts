import { generateBentoCoverPage } from "./bentoCoverPage";
import { generateBentoSupplierPage } from "./bentoSupplierPage";
import { generateBentoCategoryPage } from "./bentoCategoryPage";

export function generateBentoCatalogHTML(
  catalog: any,
  supplierLogos: any[],
  assets: any[]
) {
  const logo = assets.find(
    (asset: any) => asset.tag === "logo"
  );

  const banner = assets.find(
    (asset: any) => asset.tag === "banner"
  );

  const logoUrl = logo
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${logo.storage_url}`
    : "";

  const bannerUrl = banner
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${banner.storage_url}`
    : "";

  const brands = [
    ...new Set(
      catalog.catalog_products.map(
        (cp: any) => cp.products.brand
      )
    ),
  ] as string[];

  const coverPage =
    generateBentoCoverPage(
      catalog,
      supplierLogos,
      logoUrl,
      bannerUrl
    );

  const supplierPages = brands
    .map((brand) => {
      const supplierProducts =
        catalog.catalog_products.filter(
          (cp: any) =>
            cp.products.brand === brand
        );

      const supplierPage =
        generateBentoSupplierPage(
          catalog,
          brand,
          supplierProducts,
          supplierLogos
        );

      const categories = [
        ...new Set(
          supplierProducts.map(
            (cp: any) =>
              cp.products.category
          )
        ),
      ] as string[];

      const categoryPages = categories
        .map((category) => {
          const categoryProducts =
            supplierProducts.filter(
              (cp: any) =>
                cp.products.category ===
                category
            );

          return generateBentoCategoryPage(
            catalog,
            brand,
            category,
            categoryProducts
          );
        })
        .join("");

      return (
        supplierPage +
        categoryPages
      );
    })
    .join("");

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #e9edf0;
  font-family: Arial, Helvetica, sans-serif;
  color: #17201c;
}

.page {
  width: 794px;
  min-height: 1123px;
  margin: auto;
  padding: 34px;
  background: #f8faf8;

  display: flex;
  flex-direction: column;

  break-after: page;
  page-break-after: always;
}

.pageContent {
  flex: 1;
}

/* =========================
   FOOTER
========================= */

.footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #ccd5cf;

  display: flex;
  justify-content: space-between;

  font-size: 10px;
  color: #68736d;
}

/* =========================
   COVER
========================= */

.bentoCoverTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bentoCompanyLogo {
  width: 75px;
  height: 75px;
  object-fit: contain;
}

.bentoEdition {
  padding: 8px 14px;
  border: 1px solid #d4ddd7;
  border-radius: 100px;

  font-size: 11px;
  font-weight: 600;
}

.bentoCoverTitle {
  margin-top: 55px;
  max-width: 580px;
}

.bentoEyebrow,
.bentoSupplierEyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #728078;
}

.bentoCoverTitle h1 {
  margin: 12px 0;
  font-size: 50px;
  line-height: 1;
}

.bentoCoverTitle p {
  color: #667069;
  font-size: 16px;
}

.bentoHero {
  height: 280px;
  margin-top: 32px;

  overflow: hidden;
  border-radius: 28px;
}

.bentoHero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bentoStats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  margin-top: 20px;
}

.bentoStats div {
  padding: 18px;

  background: #17201c;
  color: white;

  border-radius: 18px;
}

.bentoStats strong {
  display: block;
  font-size: 28px;
}

.bentoStats span {
  font-size: 11px;
  opacity: 0.7;
}

.bentoSupplierSection {
  margin-top: 28px;
}

.bentoSectionHeading {
  margin-bottom: 14px;

  font-size: 17px;
  font-weight: 700;
}

.bentoSupplierGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.bentoSupplierCard {
  min-height: 72px;
  padding: 10px;

  display: flex;
  align-items: center;
  gap: 10px;

  background: white;
  border: 1px solid #dce3de;
  border-radius: 16px;

  color: inherit;
  text-decoration: none;

  font-size: 12px;
  font-weight: 700;
}

.bentoSupplierLogo,
.bentoSupplierPlaceholder {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
}

.bentoSupplierLogo {
  object-fit: contain;
}

.bentoSupplierPlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
  background: #e5ebe7;

  font-size: 20px;
}

/* =========================
   SUPPLIER PAGE
========================= */

.bentoSupplierHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding-bottom: 24px;
  border-bottom: 1px solid #d6ded9;
}

.bentoSupplierIdentity {
  display: flex;
  align-items: center;
  gap: 22px;
}

.bentoSupplierHeroLogo,
.bentoSupplierHeroPlaceholder {
  width: 90px;
  height: 90px;
}

.bentoSupplierHeroLogo {
  object-fit: contain;

  background: white;
  border-radius: 20px;
  padding: 8px;
}

.bentoSupplierHeroPlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;
  background: #e3e9e5;

  font-size: 36px;
  font-weight: bold;
}

.bentoSupplierIdentity h1 {
  margin: 8px 0;
  font-size: 38px;
}

.bentoSupplierIdentity p {
  margin: 0;
  color: #6b766f;
}

.bentoBackLink {
  color: #17201c;
  text-decoration: none;

  font-size: 11px;
  font-weight: 700;
}

.bentoCategoryIntro {
  margin-top: 40px;
}

.bentoCategoryGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.bentoCategoryCard {
  overflow: hidden;

  background: white;
  border: 1px solid #dae1dc;
  border-radius: 22px;

  color: inherit;
  text-decoration: none;
}

.bentoCategoryImages {
  height: 150px;

  display: flex;
  gap: 5px;

  padding: 8px;

  background: #f0f3f1;
}

.bentoCategoryImage {
  flex: 1;

  background: white;
  border-radius: 14px;

  overflow: hidden;
}

.bentoCategoryImage img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bentoCategoryFallback {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 45px;
  font-weight: bold;
}

.bentoCategoryInfo {
  padding: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bentoCategoryInfo h3 {
  margin: 0 0 4px;
  font-size: 17px;
}

.bentoCategoryInfo span {
  font-size: 10px;
  color: #778179;
}

.bentoCategoryArrow {
  font-size: 22px;
}

/* =========================
   CATEGORY PAGE
========================= */

.bentoCategoryHeader {
  margin-bottom: 24px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.bentoSupplierLabel {
  margin-bottom: 7px;

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;

  color: #718078;
}

.categoryHeading {
  margin: 0;

  font-size: 36px;
}

.bentoCategoryCount {
  padding: 8px 12px;

  background: #17201c;
  color: white;

  border-radius: 100px;

  font-size: 10px;
}

/* =========================
   BENTO PRODUCT LAYOUT
========================= */

.productRows {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.productRow.bentoRow {
  width: 100%;
  height: 360px;

  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 16px;

  break-inside: avoid;
  page-break-inside: avoid;
}

.productRow.bentoRow.reverse {
  grid-template-columns: 1fr 1.35fr;
}

.bentoSmallColumn {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;

  min-width: 0;
}

/* =========================
   PRODUCT CARDS
========================= */

.bentoCard {
  min-width: 0;
  overflow: hidden;

  background: white;
  border: 1px solid #dce3de;
  border-radius: 22px;
}

.bentoCard.large {
  display: grid;
  grid-template-rows: 1fr auto;
}

.bentoCard.small {
  display: grid;
  grid-template-columns: 42% 58%;
}

.bentoImageContainer {
  position: relative;

  min-width: 0;
  min-height: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px;

  background: #f1f4f2;
}

.bentoCard.large .bentoImageContainer {
  min-height: 245px;
}

.bentoProductImage {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.bentoNoImage {
  color: #929b95;
  font-size: 11px;
}

.bentoProductInfo {
  min-width: 0;

  padding: 13px;
}

.bentoProductName {
  margin: 0 0 6px;

  font-size: 14px;
  line-height: 1.2;
}

.bentoCard.large .bentoProductName {
  font-size: 18px;
}

.bentoSku {
  margin-bottom: 8px;

  color: #7a857e;
  font-size: 9px;
}

.bentoBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.bentoPrice {
  font-size: 15px;
  font-weight: 800;
}

.bentoUnit {
  font-size: 9px;
  color: #7a857e;
}

.bentoStock {
  position: absolute;

  top: 8px;
  right: 8px;

  padding: 4px 7px;

  background: #17201c;
  color: white;

  border-radius: 100px;

  font-size: 7px;
  font-weight: 700;
}

.bentoStock.out {
  background: #a83232;
}

</style>

</head>

<body>

${coverPage}

${supplierPages}

</body>

</html>
`;
}