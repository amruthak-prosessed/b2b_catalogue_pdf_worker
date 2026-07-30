import { generateBentoCoverPage } from "./bentoCoverPage";
import { generateBentoSupplierPage } from "./bentoSupplierPage";
import { generateBentoProductPages } from "./bentoProductPages";

export function generateBentoCatalogHTML(
  catalog: any,
  supplierLogos: any[],
  assets: any[]
) {

  const logo = assets.find(
    (asset: any) =>
      asset.tag === "logo"
  );

  const banner = assets.find(
    (asset: any) =>
      asset.tag === "banner"
  );

  const logoUrl = logo
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${logo.storage_url}`
    : "";

  const bannerUrl = banner
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${banner.storage_url}`
    : "";

  /* =========================================================
     ONLY CLIENT-SELECTED PRODUCTS
  ========================================================= */

  const selectedProducts =
    [...(catalog.catalog_products ?? [])]
      .filter(
        (cp: any) =>
          cp?.products
      )
      .sort(
        (a: any, b: any) =>
          (a.position ?? 0) -
          (b.position ?? 0)
      );

  const brands = [
    ...new Set(
      selectedProducts
        .map(
          (cp: any) =>
            cp.products
              ?.brand
              ?.trim()
        )
        .filter(Boolean)
    ),
  ] as string[];

  const coverPage =
    generateBentoCoverPage(
      catalog,
      supplierLogos,
      logoUrl,
      bannerUrl
    );

  const supplierPages =
    brands
      .map((brand) => {

        const supplierProducts =
          selectedProducts.filter(
            (cp: any) =>
              cp.products?.brand
                ?.trim()
                .toLowerCase() ===
              brand
                .trim()
                .toLowerCase()
          );

        return (
          generateBentoSupplierPage(
            catalog,
            brand,
            supplierProducts,
            supplierLogos
          ) +
          generateBentoProductPages(
            catalog,
            brand,
            supplierProducts
          )
        );
      })
      .join("");

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<style>

/* =========================================================
   RESET
========================================================= */

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background: #e9edf0;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #17201c;
}

/* =========================================================
   PAGE
========================================================= */

.page {
  width: 794px;
  height: 1123px;

  margin: 0 auto;

  padding:
    30px
    34px
    22px;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  position: relative;

  background: #f8faf8;

  break-after: page;
  page-break-after: always;
}

.pageContent {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* =========================================================
   FOOTER
========================================================= */

.footer {
  height: 72px;

  flex-shrink: 0;

  margin-top: auto;

  padding:
    10px
    8px
    0;

  border-top:
    3px solid #07883f;

  display: grid;

  grid-template-columns:
    1.4fr
    1fr
    0.45fr;

  align-items: center;

  column-gap: 24px;
}

.footerLeft {
  display: flex;
  align-items: center;
  gap: 12px;

  min-width: 0;
}

.footerLogo {
  width: 38px;
  height: 38px;

  object-fit: contain;

  flex-shrink: 0;
}

.footerCompany {
  margin-bottom: 3px;

  color: #333;

  font-size: 10px;

  font-weight: 700;
}

.footerAddress {
  color: #555;

  font-size: 8px;

  line-height: 1.3;
}

.footerCenter {
  color: #444;

  font-size: 8px;

  line-height: 1.25;
}

.footerCenter a {
  color: #0000ee;

  text-decoration: underline;
}

.footerRight {
  color: #555;

  text-align: right;

  font-size: 8px;
}

/* =========================================================
   COVER
========================================================= */

.bentoCover {
  background:
    linear-gradient(
      145deg,
      #f7faf8 0%,
      #ffffff 48%,
      #f1f8f4 100%
    );
}

.bentoCoverTop {
  display: flex;

  justify-content:
    space-between;

  align-items: center;
}

.bentoCoverCompany {
  display: flex;

  align-items: center;

  gap: 14px;
}

.bentoCoverLogoWrap {
  width: 70px;
  height: 70px;

  padding: 8px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: white;

  border:
    1px solid #e0e8e3;

  border-radius: 18px;
}

.bentoCompanyLogo {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.bentoCompanyLabel {
  margin-bottom: 4px;

  color: #85928a;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 1.8px;
}

.bentoCompanyName {
  color: #17201c;

  font-size: 18px;

  font-weight: 800;
}

.bentoEdition {
  padding:
    8px
    14px;

  background: #eef6f1;

  border:
    1px solid #d7e7dd;

  border-radius: 100px;

  color: #17653c;

  font-size: 10px;

  font-weight: 700;
}

/* =========================================================
   COVER TITLE
========================================================= */

.bentoCoverTitle {
  margin-top: 35px;

  max-width: 620px;
}

.bentoEyebrow,
.bentoSupplierEyebrow {
  color: #07883f;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 2px;
}

.bentoCoverTitle h1 {
  max-width: 650px;

  margin:
    9px
    0
    12px;

  color: #142019;

  font-size: 47px;

  line-height: 0.98;

  letter-spacing: -1.5px;
}

.bentoCoverTitle p {
  max-width: 520px;

  margin: 0;

  color: #69756d;

  font-size: 13px;

  line-height: 1.5;
}

/* =========================================================
   HERO
========================================================= */

.bentoHero,
.bentoHeroFallback {
  height: 235px;

  margin-top: 24px;

  position: relative;

  overflow: hidden;

  border-radius: 25px;
}

.bentoHero {
  background: #17201c;
}

.bentoHero img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.bentoHeroOverlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(10, 30, 19, 0.5),
      transparent
    );
}

.bentoHeroCaption {
  position: absolute;

  left: 22px;
  bottom: 20px;

  color: white;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 2px;
}

.bentoHeroFallback {
  background:
    linear-gradient(
      135deg,
      #113f2b,
      #07883f 55%,
      #8bd6a8
    );
}

.bentoHeroShape {
  position: absolute;

  border-radius: 50%;

  background:
    rgba(
      255,
      255,
      255,
      0.12
    );
}

.bentoHeroShapeOne {
  width: 250px;
  height: 250px;

  top: -120px;
  right: -30px;
}

.bentoHeroShapeTwo {
  width: 180px;
  height: 180px;

  bottom: -100px;
  right: 150px;
}

.bentoHeroFallbackText {
  position: absolute;

  left: 28px;
  bottom: 28px;

  color: white;
}

.bentoHeroFallbackText span {
  display: block;

  margin-bottom: 7px;

  font-size: 10px;

  opacity: 0.75;

  letter-spacing: 1px;
}

.bentoHeroFallbackText strong {
  display: block;

  max-width: 420px;

  font-size: 29px;

  line-height: 1.05;
}

/* =========================================================
   COVER STATS
========================================================= */

.bentoStats {
  margin-top: 14px;

  display: grid;

  grid-template-columns:
    1.3fr
    1fr;

  gap: 10px;
}

.bentoStats > div {
  padding:
    13px
    17px;

  border-radius: 17px;
}

.bentoStatPrimary {
  background: #17201c;

  color: white;
}

.bentoStatSecondary {
  background: #e8f6ed;

  color: #12683b;

  border:
    1px solid #d5eadc;
}

.bentoStats strong {
  display: block;

  font-size: 24px;

  line-height: 1;
}

.bentoStats span {
  display: block;

  margin-top: 5px;

  font-size: 9px;

  font-weight: 600;
}

/* =========================================================
   COVER SUPPLIERS
========================================================= */

.bentoSupplierSection {
  margin-top: 18px;
}

.bentoSupplierSectionHeader {
  margin-bottom: 10px;

  display: flex;

  align-items: flex-end;

  justify-content:
    space-between;
}

.bentoSupplierSectionEyebrow,
.bentoCategoryEyebrow {
  margin-bottom: 3px;

  color: #07883f;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 1.5px;
}

.bentoSectionHeading {
  font-size: 16px;

  font-weight: 800;
}

.bentoSupplierCount {
  color: #7a857e;

  font-size: 9px;
}

.bentoSupplierGrid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 8px;
}

.bentoSupplierCard {
  min-height: 62px;

  padding: 8px;

  display: flex;

  align-items: center;

  gap: 9px;

  position: relative;

  overflow: hidden;

  background: white;

  border:
    1px solid #dde6e0;

  border-radius: 15px;

  color: inherit;

  text-decoration: none;
}

.bentoSupplierCardLogo {
  width: 42px;
  height: 42px;

  padding: 4px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  background:
    rgba(
      255,
      255,
      255,
      0.8
    );

  border-radius: 11px;
}

.bentoSupplierLogo,
.bentoSupplierPlaceholder {
  width: 100%;
  height: 100%;
}

.bentoSupplierLogo {
  object-fit: contain;
}

.bentoSupplierPlaceholder {
  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 17px;

  font-weight: 800;
}

.bentoSupplierCardText {
  min-width: 0;
}

.bentoSupplierCardText span {
  display: block;

  overflow: hidden;

  color: #17201c;

  font-size: 10px;

  font-weight: 800;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.bentoSupplierCardText small {
  display: block;

  margin-top: 4px;

  color: #657168;

  font-size: 7px;
}

/* supplier colour accents */

.supplierColor1 {
  background: #edf8f1;
}

.supplierColor2 {
  background: #fff4e8;
}

.supplierColor3 {
  background: #eef3ff;
}

.supplierColor4 {
  background: #fff0f3;
}

.supplierColor5 {
  background: #f4f0ff;
}

/* =========================================================
   SUPPLIER HEADER
========================================================= */

.bentoSupplierHeader {
  padding-bottom: 18px;

  display: flex;

  justify-content:
    space-between;

  align-items:
    flex-start;

  border-bottom:
    1px solid #d6ded9;
}

.bentoSupplierIdentity {
  display: flex;

  align-items: center;

  gap: 16px;
}

.bentoSupplierHeroLogo,
.bentoSupplierHeroPlaceholder {
  width: 68px;
  height: 68px;
}

.bentoSupplierHeroLogo {
  padding: 6px;

  object-fit: contain;

  background: white;

  border:
    1px solid #e2e9e4;

  border-radius: 16px;
}

.bentoSupplierHeroPlaceholder {
  display: flex;

  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #dff4e7,
      #f1faf4
    );

  border-radius: 16px;

  color: #07883f;

  font-size: 29px;

  font-weight: 800;
}

.bentoSupplierIdentity h1 {
  margin:
    5px
    0;

  font-size: 31px;
}

.bentoSupplierIdentity p {
  margin: 0;

  color: #6b766f;

  font-size: 11px;
}

.bentoBackLink {
  padding:
    7px
    11px;

  background: #eef5f0;

  border-radius: 999px;

  color: #315342;

  text-decoration: none;

  font-size: 9px;

  font-weight: 700;
}

/* =========================================================
   CATEGORY NAVIGATION
========================================================= */

.bentoCategoryIntro {
  margin-top: 24px;
}

.bentoCategoryHeadingRow {
  margin-bottom: 14px;

  display: flex;

  align-items: flex-end;

  justify-content:
    space-between;
}

.bentoCategoryIntro h2 {
  margin: 0;

  font-size: 20px;
}

.bentoCategoryPageCount {
  padding:
    6px
    10px;

  background: #edf5ef;

  border-radius: 999px;

  color: #597064;

  font-size: 8px;

  font-weight: 700;
}

.bentoCategoryGrid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;
}

/* =========================================================
   CATEGORY CARD
========================================================= */

.bentoCategoryCard {
  height: 94px;

  padding: 14px;

  position: relative;

  overflow: hidden;

  display: flex;

  flex-direction: column;

  justify-content:
    flex-end;

  border:
    1px solid
    rgba(
      20,
      60,
      40,
      0.08
    );

  border-radius: 17px;

  color: #17201c;

  text-decoration: none;
}

.bentoCategoryDecor {
  position: absolute;

  width: 80px;
  height: 80px;

  top: -38px;
  left: -30px;

  border-radius: 50%;

  background:
    rgba(
      255,
      255,
      255,
      0.35
    );
}

.bentoCategoryNumber {
  position: absolute;

  top: 10px;
  right: 13px;

  color:
    rgba(
      20,
      40,
      30,
      0.13
    );

  font-size: 26px;

  line-height: 1;

  font-weight: 900;
}

.bentoCategoryCardContent {
  position: relative;

  z-index: 2;
}

.bentoCategoryName {
  margin: 0;

  font-size: 14px;

  line-height: 1.15;

  font-weight: 800;
}

.bentoCategoryMeta {
  margin-top: 5px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  color:
    rgba(
      23,
      32,
      28,
      0.68
    );

  font-size: 8px;

  font-weight: 600;
}

.bentoCategoryArrow {
  width: 22px;
  height: 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(
      255,
      255,
      255,
      0.55
    );

  border-radius: 50%;

  color: #17201c;

  font-size: 12px;
}

/* =========================================================
   CATEGORY COLOURS
========================================================= */

.categoryColor1 {
  background:
    linear-gradient(
      135deg,
      #e5f6eb,
      #f3fbf6
    );
}

.categoryColor2 {
  background:
    linear-gradient(
      135deg,
      #fff0dd,
      #fff9f1
    );
}

.categoryColor3 {
  background:
    linear-gradient(
      135deg,
      #e8efff,
      #f5f7ff
    );
}

.categoryColor4 {
  background:
    linear-gradient(
      135deg,
      #ffe8ec,
      #fff5f7
    );
}

.categoryColor5 {
  background:
    linear-gradient(
      135deg,
      #eee7ff,
      #f8f5ff
    );
}

.categoryColor6 {
  background:
    linear-gradient(
      135deg,
      #e2f6f5,
      #f2fbfa
    );
}

.categoryColor7 {
  background:
    linear-gradient(
      135deg,
      #fff5cf,
      #fffbed
    );
}

/* =========================================================
   CATEGORY DENSITY

   1–6   = larger
   7–10  = medium
   11–14 = compact
========================================================= */

.categoryGridNormal
.bentoCategoryCard {
  height: 110px;
}

.categoryGridMedium
.bentoCategoryCard {
  height: 92px;
}

.categoryGridDense
.bentoCategoryGrid {
  gap: 8px;
}

.categoryGridDense
.bentoCategoryCard {
  height: 78px;

  padding: 11px 13px;
}

.categoryGridDense
.bentoCategoryName {
  font-size: 12px;
}

.categoryGridDense
.bentoCategoryNumber {
  font-size: 22px;
}

/* =========================================================
   PRODUCT PAGE
========================================================= */

.bentoProductsPage .pageContent {
  display: flex;

  flex-direction: column;
}

.bentoProductSection {
  width: 100%;
  height: 100%;

  min-height: 0;

  display: flex;

  flex-direction: column;
}

.bentoSectionHeader {
  height: 64px;

  flex-shrink: 0;

  margin-bottom: 12px;

  display: flex;

  justify-content:
    space-between;

  align-items:
    flex-end;
}

.bentoSupplierLabel {
  margin-bottom: 5px;

  color: #738078;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 1px;
}

.bentoProductSectionTitle {
  margin: 0;

  font-size: 26px;

  line-height: 1.1;
}

.bentoContinued {
  margin-left: 7px;

  color: #7b857f;

  font-size: 9px;

  font-weight: 500;
}

.bentoSectionProductCount {
  padding:
    6px
    11px;

  background: #17201c;

  color: white;

  border-radius: 999px;

  font-size: 8px;

  font-weight: 700;
}

/* =========================================================
   PRODUCT PAGE NAVIGATION
========================================================= */

.bentoProductHeaderRight {
  display: flex;

  flex-direction: column;

  align-items: flex-end;

  gap: 7px;
}

.bentoProductNavigation {
  display: flex;

  align-items: center;

  gap: 6px;
}

.bentoProductNavButton {
  padding:
    5px
    9px;

  background: #edf5ef;

  border:
    1px solid #dbe9df;

  border-radius: 999px;

  color: #315342;

  text-decoration: none;

  font-size: 7px;

  font-weight: 800;

  white-space: nowrap;
}

.bentoProductNavTop {
  background: #17201c;

  border-color: #17201c;

  color: white;
}

/* =========================================================
   PRODUCT CARD
========================================================= */

.productTile {
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  border-radius: 18px;
}

.productTile > * {
  width: 100% !important;
  height: 100% !important;
}

/* =========================================================
   CARD BASE
========================================================= */

.bentoCard,
.bentoProductCard {
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  position: relative;

  overflow: hidden;

  display: grid;

  grid-template-rows:
    minmax(0, 1fr)
    auto;

  border:
    1px solid
    rgba(
      40,
      60,
      50,
      0.08
    );

  border-radius: 18px;
}

/* =========================================================
   IMAGE AREA
========================================================= */

.bentoImageContainer,
.bentoProductImageWrap {
  position: relative;

  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  padding: 10px;

  overflow: hidden;

  display: flex;

  align-items: center;
  justify-content: center;
}

/* =========================================================
   DECORATIVE SHAPES
========================================================= */

.bentoProductDecor {
  position: absolute;

  pointer-events: none;

  border-radius: 50%;

  background:
    rgba(
      255,
      255,
      255,
      0.32
    );
}

.bentoProductDecorOne {
  width: 110px;
  height: 110px;

  top: -55px;
  left: -45px;
}

.bentoProductDecorTwo {
  width: 75px;
  height: 75px;

  right: -32px;
  bottom: -28px;

  background:
    rgba(
      255,
      255,
      255,
      0.22
    );
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

.bentoProductImage {
  position: relative;

  z-index: 1;

  display: block;

  width: 100%;
  height: 100%;

  max-width: 100%;
  max-height: 100%;

  object-fit: contain;
}

/* =========================================================
   NO IMAGE
========================================================= */

.bentoNoImage {
  position: relative;

  z-index: 1;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 5px;

  color:
    rgba(
      30,
      50,
      40,
      0.45
    );

  font-size: 8px;

  font-weight: 700;
}

.bentoNoImageIcon {
  font-size: 25px;

  line-height: 1;
}

/* =========================================================
   PRODUCT INFO
========================================================= */

.bentoProductInfo {
  min-width: 0;

  padding:
    8px
    10px;

  overflow: hidden;

  display: flex;

  align-items: flex-end;

  justify-content:
    space-between;

  gap: 8px;

  border-top:
    1px solid
    rgba(
      30,
      50,
      40,
      0.06
    );

  background:
    rgba(
      255,
      255,
      255,
      0.84
    );
}

.bentoProductText {
  min-width: 0;

  flex: 1;
}

.bentoProductName {
  margin:
    0
    0
    3px;

  overflow: hidden;

  color: #17201c;

  font-size: 10px;

  line-height: 1.15;

  font-weight: 800;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient:
    vertical;
}

.bentoSku {
  overflow: hidden;

  color: #748078;

  font-size: 6px;

  line-height: 1.2;

  text-overflow:
    ellipsis;

  white-space: nowrap;
}

/* =========================================================
   PRICE / UNIT
========================================================= */

.bentoBottom {
  flex-shrink: 0;

  display: flex;

  flex-direction: column;

  align-items:
    flex-end;

  justify-content:
    flex-end;

  gap: 3px;
}

.bentoPrice {
  color: #17201c;

  font-size: 11px;

  line-height: 1;

  font-weight: 900;
}

.bentoUnit {
  padding:
    3px
    6px;

  background:
    rgba(
      255,
      255,
      255,
      0.7
    );

  border-radius: 999px;

  color: #4d5b53;

  font-size: 7px;

  line-height: 1;

  font-weight: 800;

  white-space: nowrap;
}

/* =========================================================
   STOCK
========================================================= */

.bentoStock {
  position: absolute;

  top: 8px;
  right: 8px;

  z-index: 5;

  padding:
    4px
    7px;

  background:
    rgba(
      22,
      132,
      71,
      0.92
    );

  color: white;

  border-radius: 999px;

  font-size: 6px;

  font-weight: 800;
}

.bentoStock.out {
  background:
    rgba(
      168,
      50,
      50,
      0.92
    );
}

/* =========================================================
   PRODUCT COLOUR 1 — GREEN
========================================================= */

.productColor1 {
  background:
    #e6f6eb;
}

.productColor1
.bentoImageContainer {
  background:
    linear-gradient(
      145deg,
      #dff4e7,
      #f2faf5
    );
}

/* =========================================================
   PRODUCT COLOUR 2 — PEACH
========================================================= */

.productColor2 {
  background:
    #fff1e1;
}

.productColor2
.bentoImageContainer {
  background:
    linear-gradient(
      145deg,
      #ffead3,
      #fff8ef
    );
}

/* =========================================================
   PRODUCT COLOUR 3 — BLUE
========================================================= */

.productColor3 {
  background:
    #eaf0ff;
}

.productColor3
.bentoImageContainer {
  background:
    linear-gradient(
      145deg,
      #e1eaff,
      #f4f7ff
    );
}

/* =========================================================
   PRODUCT COLOUR 4 — PINK
========================================================= */

.productColor4 {
  background:
    #ffe9ee;
}

.productColor4
.bentoImageContainer {
  background:
    linear-gradient(
      145deg,
      #ffe2e9,
      #fff5f7
    );
}

/* =========================================================
   PRODUCT COLOUR 5 — PURPLE
========================================================= */

.productColor5 {
  background:
    #f0eaff;
}

.productColor5
.bentoImageContainer {
  background:
    linear-gradient(
      145deg,
      #e9e0ff,
      #f8f5ff
    );
}

/* =========================================================
   PRODUCT COLOUR 6 — TEAL
========================================================= */

.productColor6 {
  background:
    #e3f6f4;
}

.productColor6
.bentoImageContainer {
  background:
    linear-gradient(
      145deg,
      #daf2ef,
      #f2fbfa
    );
}

/* =========================================================
   PRODUCT COLOUR 7 — YELLOW
========================================================= */

.productColor7 {
  background:
    #fff6d7;
}

.productColor7
.bentoImageContainer {
  background:
    linear-gradient(
      145deg,
      #fff1bd,
      #fffbed
    );
}
/* =========================================================
   PRODUCT BENTO COMMON
========================================================= */

.productBento {
  width: 100%;

  flex: 1;

  min-height: 0;

  display: grid;

  gap: 10px;
}

/* =========================================================
   1 PRODUCT
========================================================= */

.productBentoOne {
  width: 68%;

  height: 650px;

  flex: none;

  grid-template-columns:
    minmax(0, 1fr);
}

/* =========================================================
   2 PRODUCTS
========================================================= */

.productBentoTwo {
  height: 680px;

  flex: none;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   3 PRODUCTS
========================================================= */

.productBentoThree {
  grid-template-columns:
    1.25fr
    1fr;

  grid-template-rows:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

.productBentoThree .threeLarge {
  grid-column: 1;

  grid-row:
    1 / 3;
}

.productBentoThree .threeSmall1 {
  grid-column: 2;

  grid-row: 1;
}

.productBentoThree .threeSmall2 {
  grid-column: 2;

  grid-row: 2;
}

/* =========================================================
   4 PRODUCTS
========================================================= */

.productBentoFour {
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  grid-template-rows:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   5 PRODUCTS
========================================================= */

.productBentoFive {
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  grid-template-rows:
    repeat(
      3,
      minmax(0, 1fr)
    );
}

.productBentoFive .fiveLarge {
  grid-column:
    1 / 3;

  grid-row:
    1 / 3;
}

.productBentoFive .fiveSmall1 {
  grid-column:
    3 / 5;

  grid-row: 1;
}

.productBentoFive .fiveSmall2 {
  grid-column:
    3 / 5;

  grid-row: 2;
}

.productBentoFive .fiveBottom1 {
  grid-column:
    1 / 3;

  grid-row: 3;
}

.productBentoFive .fiveBottom2 {
  grid-column:
    3 / 5;

  grid-row: 3;
}

/* =========================================================
   6 PRODUCTS
========================================================= */

.productBentoSix {
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  grid-template-rows:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   7 PRODUCTS
========================================================= */

.productBentoSeven {
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  grid-template-rows:
    repeat(
      3,
      minmax(0, 1fr)
    );
}

.productBentoSeven .sevenLarge {
  grid-column:
    1 / 3;

  grid-row:
    1 / 3;
}

.productBentoSeven .sevenSmall1 {
  grid-column: 3;
  grid-row: 1;
}

.productBentoSeven .sevenSmall2 {
  grid-column: 4;
  grid-row: 1;
}

.productBentoSeven .sevenSmall3 {
  grid-column: 3;
  grid-row: 2;
}

.productBentoSeven .sevenSmall4 {
  grid-column: 4;
  grid-row: 2;
}

.productBentoSeven .sevenBottom1 {
  grid-column:
    1 / 3;

  grid-row: 3;
}

.productBentoSeven .sevenBottom2 {
  grid-column:
    3 / 5;

  grid-row: 3;
}

/* =========================================================
   8 PRODUCTS
========================================================= */

.productBentoEight {
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  grid-template-rows:
    repeat(
      3,
      minmax(0, 1fr)
    );
}

.productBentoEight .eightLarge {
  grid-column:
    1 / 3;

  grid-row:
    1 / 3;
}

.productBentoEight .eightSmall1 {
  grid-column: 3;
  grid-row: 1;
}

.productBentoEight .eightSmall2 {
  grid-column: 4;
  grid-row: 1;
}

.productBentoEight .eightSmall3 {
  grid-column: 3;
  grid-row: 2;
}

.productBentoEight .eightSmall4 {
  grid-column: 4;
  grid-row: 2;
}

.productBentoEight .eightBottom1 {
  grid-column: 1;
  grid-row: 3;
}

.productBentoEight .eightBottom2 {
  grid-column: 2;
  grid-row: 3;
}

.productBentoEight .eightBottom3 {
  grid-column:
    3 / 5;

  grid-row: 3;
}

/* =========================================================
   SMALL PRODUCT TEXT
========================================================= */

.productBentoSeven
.productTile:not(.sevenLarge)
.bentoProductInfo,

.productBentoEight
.productTile:not(.eightLarge)
.bentoProductInfo {
  padding:
    5px
    7px;
}

.productBentoSeven
.productTile:not(.sevenLarge)
.bentoProductName,

.productBentoEight
.productTile:not(.eightLarge)
.bentoProductName {
  font-size: 8px;
}

.productBentoSeven
.productTile:not(.sevenLarge)
.bentoSku,

.productBentoEight
.productTile:not(.eightLarge)
.bentoSku {
  font-size: 6px;
}

.productBentoSeven
.productTile:not(.sevenLarge)
.bentoPrice,

.productBentoEight
.productTile:not(.eightLarge)
.bentoPrice {
  font-size: 9px;
}

.productBentoSeven
.productTile:not(.sevenLarge)
.bentoUnit,

.productBentoEight
.productTile:not(.eightLarge)
.bentoUnit {
  font-size: 7px;
}

/* =========================================================
   PRINT
========================================================= */

@media print {

  body {
    background: white;
  }

  .page {
    margin: 0;

    break-after: page;

    page-break-after: always;
  }

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