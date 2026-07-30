import { generateCoverPage } from "./classicCoverPage";
import { generateSupplierPage } from "./classicSupplierPage";
import { generateCategoryPage } from "./classicCategoryPage";
import { generateProductCard } from "./classicProductCard";



export function generateCatalogHTML(
  catalog: any,
  supplierLogos: any[],
  assets: any[]
) {

  const logo = assets.find(
    (a: any) => a.tag === "logo"
  );

  const banner = assets.find(
    (a: any) => a.tag === "banner"
  );

  const background = assets.find(
    (a: any) => a.tag === "background"
  );

  const logoUrl = logo
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${logo.storage_url}`
    : "";

  const bannerUrl = banner
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${banner.storage_url}`
    : "";

  const backgroundUrl = background
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${background.storage_url}`
    : "";

  const brands = [
  ...new Set(
    catalog.catalog_products.map(
      (cp:any) => cp.products.brand
    )
  )
];


const coverPages = generateCoverPage(
  catalog,
  supplierLogos,
  logoUrl,
  bannerUrl,
  backgroundUrl
);


const allPages = brands.map((brand) => {

    const supplierProducts =
        catalog.catalog_products.filter(
            (cp:any)=>
                cp.products.brand===brand
        );

    const supplierLogo =
        supplierLogos.find(
            (s:any)=>s.brand===brand
        );

    const supplierLogoUrl =
        supplierLogo
        ? `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${supplierLogo.asset_path}`
        : "";

    const categories = [

        ...new Set(

            supplierProducts.map(
                (cp:any)=>cp.products.category
            )

        )

    ];
    /*
 * Estimate how many rows the
 * subcategory chips will occupy.
 *
 * Approximately 5 chips per row.
 */

const firstCategory = categories[0];

const firstCategoryProducts =
    supplierProducts.filter(
        (cp:any)=>
            cp.products.category===firstCategory
    );

const firstCategoryHtml =
  generateCategoryPage(
    catalog,
    brand,
    firstCategory,
    firstCategoryProducts,
    supplierLogoUrl,
    false
  );

const supplierIntro =
    generateSupplierPage(
        catalog,
        brand,
        supplierProducts,
        supplierLogos,
        firstCategoryHtml
    );

const remainingCategoryPages =
    categories
        .slice(1)
        .map(category=>{

            const products =
                supplierProducts.filter(
                    (cp:any)=>
                        cp.products.category===category
                );

            return generateCategoryPage(
                catalog,
                brand,
                category,
                products,
                supplierLogoUrl,
                true
            );

        })
        .join("");

return supplierIntro + remainingCategoryPages;

}).join("");

return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
font-family:Arial,Helvetica,sans-serif;
background:#f3f5f7;
}

.page{

width:794px;

min-height:1123px;

background:white;

margin:auto;

padding:30px;

display:flex;

flex-direction:column;

}
.header{
display:flex;
justify-content:space-between;
align-items:flex-start;
margin-bottom:20px;
}

.left{
display:flex;
gap:20px;
align-items:center;
}

.companyLogo{
width:70px;
height:70px;
object-fit:contain;
border-radius:10px;
border:1px solid #ddd;
}

.right{
display:flex;
gap:12px;
align-items:flex-start;
}

.dateBox,
.countBox{
background:#f4f4f4;
padding:12px;
border-radius:8px;
text-align:center;
min-width:85px;
font-weight:bold;
}

.countBox span{
display:block;
font-size:12px;
font-weight:normal;
}

.banner{
margin-top:20px;
margin-bottom:25px;
}

.bannerImage{
width:100%;
height:170px;
object-fit:cover;
border-radius:12px;
display:block;
}

.section{
margin-top:25px;
margin-bottom:25px;
padding:20px;
border:1px solid #dcdcdc;
border-radius:10px;
}

.sectionTitle{
font-size:28px;
font-weight:bold;
letter-spacing:1px;
margin-bottom:10px;
color:#1b1b1b;
}


.supplierLogoPlaceholder{
width:55px;
height:55px;
border-radius:8px;
background:#eef4ee;
display:flex;
align-items:center;
justify-content:center;
font-size:22px;
font-weight:bold;
color:#0b7a3b;
flex-shrink:0;
}

.sectionSubtitle{
font-size:14px;
color:#666;
}

.supplierGrid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:18px;
margin-top:20px;
}

.supplierCard{
display:flex;
align-items:center;
gap:15px;
padding:15px;
border:1px solid #dcdcdc;
border-radius:10px;
background:white;
min-height:80px;
}

.supplierLogo{
width:55px;
height:55px;
object-fit:contain;
}

.supplierName{
font-size:16px;
font-weight:600;
}

.footer{
margin-top:auto;
padding-top:20px;
border-top:3px solid #0b7a3b;
display:flex;
justify-content:space-between;
align-items:center;
font-size:12px;
color:#555;
}

.productImage{
    width:100%;
    height:100%;
    object-fit:contain;
}
.footerLeft{
display:flex;
align-items:center;
gap:15px;
}

.footerLogo{
width:45px;
height:45px;
object-fit:contain;
}

.footerCompany{
font-weight:bold;
margin-bottom:5px;
}

.pageNumber{
font-weight:bold;
}

.pageContent{

flex:1;

}

.categoryTitle{
font-size:34px;
font-weight:bold;
margin-bottom:25px;
color:#222;
}

.productItem{
padding:14px;
margin-bottom:12px;
border:1px solid #ddd;
border-radius:8px;
font-size:18px;
background:white;
}


.supplierHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-bottom: 20px;
    border-bottom: 3px solid #0b7a3b;
}



.subCategories{

display:flex;

gap:12px;

flex-wrap:wrap;

margin-bottom:25px;

}

.categoryChip{

padding:8px 18px;

background:#eef4ee;

border-radius:8px;

font-weight:600;

}

.categoryHeading{

margin-top:30px;

margin-bottom:20px;

font-size:24px;

}


.productCard{
    width:100%;
    min-width:0;
    padding:10px;
    border:1px solid #ddd;
    border-radius:8px;
    display:flex;
    flex-direction:column;

    /* Important for PDF */
    break-inside:avoid;
    page-break-inside:avoid;
}

.supplierHeader{

display:flex;

align-items:center;

gap:18px;

padding-bottom:18px;

border-bottom:3px solid #0b7a3b;

margin-bottom:20px;

}

.supplierHeaderLogo{

width:60px;

height:60px;

object-fit:contain;

border:1px solid #ddd;

border-radius:8px;

background:white;

padding:4px;

}


.supplierLeft {
    display: flex;
    align-items: center;
    gap: 14px;
}

.supplierLeft h1 {
    margin: 0;
}


.supplierItemCount {
    background: #0b7a3b;
    color: white;
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: bold;
    white-space: nowrap;
}


.supplierNavigation {
    display: flex;
    align-items: center;
    gap: 18px;
}

.supplierNavigation a {
    color: #0b7a3b;
    text-decoration: none;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
}
.itemBadge{

background:#0b7a3b;

color:white;

padding:8px 14px;

border-radius:6px;

font-weight:bold;

font-size:13px;

}

.subTitle{

margin-top:20px;

margin-bottom:10px;

font-size:15px;

letter-spacing:1px;

color:#555;

}

.productName{
    font-size:14px;
    line-height:17px;
    font-weight:bold;
    margin-bottom:4px;
}

.productSku{
    font-size:9px;
    color:#777;
    margin-bottom:2px;
}




.productBrand{
    font-size:10px;
    margin-bottom:2px;
}

.productPrice{
    font-size:14px;
    font-weight:bold;
    color:#0b7a3b;
    margin-bottom:2px;
}


.productUnit{
    font-size:9px;
}

.productStock{

margin-top:auto;

font-weight:bold;

font-size:13px;

}


.imageContainer{
    position:relative;
    width:100%;
    height:125px;
    margin-bottom:8px;
}

.stockBadge{
    position:absolute;
    top:5px;
    right:5px;
    background:#0b7a3b;
    color:white;
    padding:2px 5px;
    font-size:8px;
    border-radius:3px;
    font-weight:bold;
}

.stockBadge.out{

background:#c62828;

}


.productRows {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
}

.productRow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    width: 100%;
    break-inside: avoid;
    page-break-inside: avoid;
}

.productRow .productCard {
    width: auto;
    min-width: 0;
    box-sizing: border-box;
}

.pageLinks {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 18px;

    margin-top: 12px;
    margin-bottom: 18px;

    font-size: 12px;
}

.pageLinks a {
    color: #00843d;
    text-decoration: none;
    font-weight: 600;
}

.categoryTitleRow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
}

.categoryTitleRow .categoryHeading {
    margin: 0;
}

.categoryCount {
    background: #0b7a3b;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
}


</style>

</head>

<body>


${coverPages}

${allPages}
</body>

</html>
`;

}