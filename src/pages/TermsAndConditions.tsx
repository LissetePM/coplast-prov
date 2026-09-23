import LegalPage, { LegalSection, LegalValue } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/config/business";
import { LEGAL } from "@/config/legal";

// Términos de uso del sitio. Describen la naturaleza informativa del catálogo
// y dejan claro que una cotización no obliga a nadie, que es justo el riesgo
// de un sitio que muestra precios sin ser tienda en línea.

export default function TermsAndConditions() {
  return (
    <LegalPage
      path="/terminos-y-condiciones"
      metaTitle="Términos y Condiciones de Uso | Coplast de México"
      metaDescription="Términos y condiciones de uso del sitio de Coplast de México: naturaleza informativa del catálogo, alcance de las cotizaciones, propiedad intelectual y responsabilidad."
      title="Términos y Condiciones de Uso"
      intro={`Estos términos regulan el uso del sitio web de ${LEGAL.tradeName}. Te pedimos leerlos antes de navegar o solicitar una cotización, porque explican qué puedes esperar de la información publicada aquí y qué no.`}
    >
      <LegalSection id="titular" heading="1. Titular del sitio">
        <p>
          Este sitio web es operado por <strong><LegalValue value={LEGAL.legalName} /></strong>, que opera
          comercialmente como <strong>{LEGAL.tradeName}</strong>, con Registro Federal de Contribuyentes{" "}
          <LegalValue value={LEGAL.rfc} /> y domicilio en <LegalValue value={LEGAL.address} />.
        </p>
        <p>
          Es una empresa mexicana dedicada a la fabricación y comercialización de productos plásticos e
          implementos para los sectores avícola y ganadero.
        </p>
      </LegalSection>

      <LegalSection id="aceptacion" heading="2. Aceptación y uso permitido">
        <p>
          Al acceder y utilizar este sitio aceptas estos términos. Si no estás de acuerdo con ellos, te
          pedimos no utilizarlo.
        </p>
        <p>
          Puedes consultar el catálogo, armar solicitudes de cotización y contactarnos con fines lícitos
          y de buena fe. Te comprometes a no:
        </p>
        <ul>
          <li>Utilizar el sitio con fines ilícitos o contrarios a estos términos.</li>
          <li>Intentar vulnerar su seguridad, interferir en su funcionamiento o acceder a áreas o sistemas no destinados al público.</li>
          <li>Extraer masivamente el contenido mediante robots, <em>scraping</em> u otros medios automatizados sin nuestra autorización.</li>
          <li>Proporcionar datos falsos, de terceros sin su consentimiento, o suplantar la identidad de otra persona o empresa.</li>
        </ul>
      </LegalSection>

      <LegalSection id="catalogo" heading="3. El catálogo es informativo">
        <p>
          La información de productos publicada en este sitio tiene{" "}
          <strong>carácter meramente informativo y promocional</strong>. Este sitio{" "}
          <strong>no es una tienda en línea</strong>: no realiza ventas, no procesa pagos y no formaliza
          pedidos.
        </p>
        <p>
          Los precios mostrados son referencias vigentes al momento de su publicación y no constituyen
          una oferta vinculante. Algunos productos se muestran con la leyenda «Consulta precio» cuando su
          precio no está confirmado; en ese caso no se calcula importe alguno y es necesario contactarnos.
        </p>
      </LegalSection>

      <LegalSection id="cotizaciones" heading="4. Alcance de las solicitudes de cotización">
        <p>
          El envío de una solicitud a través del sitio, así como el documento de cotización que se genera
          y se te hace llegar, constituyen únicamente una{" "}
          <strong>invitación a tratar y una referencia comercial</strong>.
        </p>
        <p>
          <strong>No constituyen aceptación de pedido, confirmación de existencias ni contrato de
          compraventa.</strong> Ninguna operación se entiende perfeccionada hasta que exista confirmación
          expresa de nuestra parte por un medio directo, junto con el acuerdo sobre precio final,
          cantidades, condiciones de pago, tiempos y lugar de entrega.
        </p>
        <p>
          Nos reservamos el derecho de no aceptar una solicitud o de ajustarla cuando existan errores
          evidentes, falta de existencias o condiciones que impidan atenderla.
        </p>
      </LegalSection>

      <LegalSection id="especificaciones" heading="5. Precios, disponibilidad y especificaciones">
        <p>
          Los precios, la disponibilidad, las capacidades, las medidas, los colores, las presentaciones,
          las piezas por paquete, los materiales y las demás especificaciones publicadas{" "}
          <strong>están sujetos a cambio sin previo aviso y a confirmación</strong> por nuestra parte al
          momento de atender tu solicitud.
        </p>
        <p>
          Las fotografías e imágenes son ilustrativas. Los colores pueden variar respecto del producto
          físico por razones de fabricación, de lote y de la calibración de cada pantalla, y la
          disponibilidad de colores específicos está sujeta a existencias.
        </p>
        <p>
          Procuramos que la información sea correcta y esté actualizada, pero no garantizamos que se
          encuentre libre de errores tipográficos u omisiones. Detectado un error, podremos corregirlo en
          cualquier momento, incluso después de haber emitido una cotización.
        </p>
      </LegalSection>

      <LegalSection id="propiedad" heading="6. Propiedad intelectual">
        <p>
          La marca, el logotipo, el nombre comercial, los textos, las fotografías de producto, el diseño,
          la estructura y el código de este sitio son propiedad de{" "}
          <LegalValue value={LEGAL.legalName} /> o se utilizan con la autorización correspondiente, y
          están protegidos por la legislación mexicana en materia de propiedad intelectual e industrial.
        </p>
        <p>
          Se autoriza la consulta y la reproducción puntual del contenido con fines informativos propios,
          sin alterarlo. Queda prohibida su reproducción total o parcial con fines comerciales, su
          distribución, comunicación pública, transformación o cualquier uso que pueda generar confusión
          sobre el origen de los productos, sin autorización previa y por escrito.
        </p>
      </LegalSection>

      <LegalSection id="terceros" heading="7. Enlaces y servicios de terceros">
        <p>
          El sitio incluye enlaces a servicios de terceros, como WhatsApp para contacto directo y
          aplicaciones de correo electrónico. Al utilizarlos sales de nuestro sitio y quedas sujeto a los
          términos y las políticas de privacidad de sus respectivos titulares.
        </p>
        <p>
          No controlamos esos servicios ni respondemos por su contenido, disponibilidad, prácticas de
          privacidad o el tratamiento que den a tu información.
        </p>
      </LegalSection>

      <LegalSection id="disponibilidad" heading="8. Disponibilidad del sitio">
        <p>
          Procuramos que el sitio esté disponible de forma continua, pero no garantizamos su
          funcionamiento ininterrumpido ni libre de errores. Puede suspenderse total o parcialmente por
          mantenimiento, actualizaciones, fallas técnicas, causas atribuibles a nuestros proveedores o
          eventos de fuerza mayor.
        </p>
        <p>
          Podemos modificar, suspender o descontinuar cualquier sección, funcionalidad o contenido del
          sitio en cualquier momento.
        </p>
      </LegalSection>

      <LegalSection id="responsabilidad" heading="9. Limitación de responsabilidad">
        <p>
          El uso del sitio y de la información publicada es bajo tu propio riesgo. En la medida permitida
          por la legislación aplicable, no seremos responsables por daños indirectos, incidentales o
          consecuenciales, ni por pérdida de beneficios, derivados del uso o de la imposibilidad de usar
          el sitio, de errores en la información publicada o de la interrupción del servicio.
        </p>
        <p>
          Esta limitación <strong>no excluye ni restringe la responsabilidad que conforme a la
          legislación mexicana resulte irrenunciable</strong>, incluida la derivada de dolo o mala fe, ni
          los derechos que la normativa aplicable reconozca a consumidores. Tampoco afecta las
          obligaciones y garantías que asumamos respecto de los productos efectivamente vendidos, las
          cuales se rigen por el acuerdo comercial correspondiente y no por este sitio.
        </p>
      </LegalSection>

      <LegalSection id="modificaciones" heading="10. Modificaciones a estos términos">
        <p>
          Podemos actualizar estos términos en cualquier momento. La versión vigente será siempre la
          publicada en esta página, con su fecha de última actualización. El uso del sitio después de una
          modificación implica su aceptación.
        </p>
      </LegalSection>

      <LegalSection id="ley" heading="11. Legislación aplicable y jurisdicción">
        <p>
          Estos términos se rigen por la <strong>legislación mexicana</strong>.
        </p>
        <p>
          Para la interpretación y el cumplimiento de estos términos, las partes se someten a la
          jurisdicción de los tribunales competentes de{" "}
          <strong><LegalValue value={LEGAL.jurisdiction} /></strong>, renunciando a cualquier otro fuero
          que pudiera corresponderles por razón de sus domicilios presentes o futuros, sin perjuicio de
          los derechos que la ley reconozca de manera irrenunciable a los consumidores.
        </p>
      </LegalSection>

      <LegalSection id="contacto" heading="12. Contacto">
        <p>
          Para cualquier duda sobre estos términos puedes escribirnos a{" "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> o llamarnos al{" "}
          <strong>{BUSINESS.phone}</strong>.
        </p>
        <p>
          Si tu consulta se refiere al tratamiento de tus datos personales, revisa nuestro{" "}
          <a href="/aviso-de-privacidad">Aviso de Privacidad</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
