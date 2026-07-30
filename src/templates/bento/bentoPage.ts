import { generateFooter } from "../components/Footer";

export function generateBentoPage(
  catalog: any,
  content: string
) {
  return `
    <section class="page">
      <div class="pageContent">
        ${content}
      </div>

      ${generateFooter(catalog)}
    </section>
  `;
}