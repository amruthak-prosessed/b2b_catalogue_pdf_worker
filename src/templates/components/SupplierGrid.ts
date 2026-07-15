export function generateSupplierGrid(
  supplierLogos: any[]
) {

  const baseUrl =
`${process.env.SUPABASE_URL}/storage/v1/object/public/assets`;

  return `

<div class="supplierGrid">

${supplierLogos.map((logo:any)=>`

<div class="supplierCard">

<img
class="supplierLogo"
src="${baseUrl}/${logo.asset_path}"
alt="${logo.brand}"
/>

<div class="supplierName">

${logo.brand}

</div>

</div>

`).join("")}

</div>

`;

}