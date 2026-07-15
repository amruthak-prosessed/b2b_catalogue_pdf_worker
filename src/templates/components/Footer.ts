export function generateFooter(
  catalog: any
) {

  const company = catalog.companies;

  const logoUrl =
    `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${company.logo_url}`;

  return `

<div class="footer">

  <div class="footerLeft">

    <img
      class="footerLogo"
      src="${logoUrl}"
    />

    <div>

      <div class="footerCompany">
        ${company.name}
      </div>

      <div class="footerAddress">
        ${company.address ?? ""}
      </div>

    </div>

  </div>


  <div class="footerCenter">

        <div>
            CONTACT US
        </div>

        ${
            company.phone
            ? `
                <div>
                <a href="tel:${company.phone}">
                    ${company.phone}
                </a>
                </div>
            `
            : ""
        }

        ${
            company.email
            ? `
                <div>
                <a href="mailto:${company.email}">
                    ${company.email}
                </a>
                </div>
            `
            : ""
        }

        ${
            company.website
            ? `
                <div>
                <a
                    href="${
                    company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }"
                    target="_blank"
                >
                    ${company.website}
                </a>
                </div>
            `
            : ""
        }

        </div>


  <div class="footerRight">
  </div>

</div>

`;

}