import LegalPage, { LegalSection, LegalValue } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/config/business";
import { LEGAL } from "@/config/legal";

// Aviso de privacidad integral. El contenido describe únicamente lo que el
// sitio hace hoy: formulario de cotización, WhatsApp, teléfono, correo y
// almacenamiento local del carrito. No se declara ninguna finalidad,
// transferencia ni tecnología que no exista en el código.

export default function PrivacyNotice() {
  return (
    <LegalPage
      path="/aviso-de-privacidad"
      metaTitle="Aviso de Privacidad | Coplast de México"
      metaDescription="Aviso de privacidad integral de Coplast de México: qué datos personales recabamos a través del sitio, para qué los usamos y cómo ejercer tus derechos ARCO."
      title="Aviso de Privacidad Integral"
      intro={`En ${LEGAL.tradeName} sabemos que tus datos personales son tuyos. Este aviso explica, sin rodeos, qué información recabamos a través de este sitio, para qué la usamos, con quién se apoya su tratamiento y cómo puedes controlarla en todo momento.`}
    >
      <LegalSection id="responsable" heading="1. Quién es el responsable de tus datos">
        <p>
          El responsable del tratamiento de tus datos personales es{" "}
          <strong><LegalValue value={LEGAL.legalName} /></strong>, que opera comercialmente como{" "}
          <strong>{LEGAL.tradeName}</strong>, con Registro Federal de Contribuyentes{" "}
          <LegalValue value={LEGAL.rfc} />.
        </p>
        <p>
          Domicilio para oír y recibir notificaciones, así como para presentar solicitudes relacionadas
          con este aviso: <LegalValue value={LEGAL.address} />.
        </p>
        <p>
          Datos de contacto: teléfono <strong>{BUSINESS.phone}</strong>, correo electrónico
          comercial <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> y sitio web{" "}
          <strong>{BUSINESS.web}</strong>.
        </p>
      </LegalSection>

      <LegalSection id="datos" heading="2. Qué datos personales recabamos">
        <p>
          Solo pedimos lo necesario para atenderte. Los datos que recabamos dependen del medio que
          elijas para contactarnos:
        </p>
        <ul>
          <li>
            <strong>Formulario de cotización del sitio.</strong> Son obligatorios el nombre de la
            persona de contacto, el teléfono y el correo electrónico. Son opcionales el nombre o razón
            social de tu empresa y tu ciudad o estado. Junto con ellos se registran los productos,
            presentaciones y cantidades que agregaste a tu cotización.
          </li>
          <li>
            <strong>WhatsApp.</strong> Al usar los botones de WhatsApp se abre una conversación con tu
            número telefónico y el nombre de perfil que tengas configurado, además del mensaje que nos
            envíes, que puede incluir el detalle de los productos de tu interés.
          </li>
          <li>
            <strong>Teléfono.</strong> Los datos que nos proporciones durante la llamada, normalmente
            tu nombre, tu número y la información de tu solicitud.
          </li>
          <li>
            <strong>Correo electrónico.</strong> Tu dirección de correo y el contenido de tu mensaje.
          </li>
          <li>
            <strong>Datos técnicos del sitio.</strong> Nuestro proveedor de alojamiento registra, de
            forma automática y por razones de seguridad y operación, datos como la dirección IP desde
            la que navegas, la fecha y hora de acceso y el tipo de navegador.
          </li>
        </ul>
        <p>
          <strong>No recabamos datos personales sensibles</strong> —como los relativos a salud, origen
          racial o étnico, creencias religiosas, opiniones políticas o preferencias sexuales— ni datos
          patrimoniales o financieros a través de este sitio. Este sitio{" "}
          <strong>no es una tienda en línea</strong>: no procesa compras ni pagos, por lo que nunca te
          pediremos datos de tarjetas ni credenciales bancarias en él.
        </p>
        <p>
          Tampoco recabamos datos de menores de edad. Este sitio está dirigido a empresas, granjas,
          distribuidores y personas mayores de edad con capacidad legal para contratar.
        </p>
      </LegalSection>

      <LegalSection id="finalidades" heading="3. Para qué usamos tus datos">
        <p>
          <strong>Finalidades primarias.</strong> Son las que dan origen y son necesarias para la
          relación con nosotros:
        </p>
        <ul>
          <li>Identificarte y atender tu solicitud de información o de cotización.</li>
          <li>
            Elaborar la cotización, generar el documento PDF correspondiente y enviártelo al correo
            electrónico que nos proporciones.
          </li>
          <li>Contactarte por teléfono, WhatsApp o correo para dar seguimiento a tu solicitud, aclarar dudas y confirmar precios, disponibilidad y condiciones de entrega.</li>
          <li>Llevar el registro y control interno de las cotizaciones emitidas.</li>
          <li>Cumplir con las obligaciones legales que resulten aplicables.</li>
        </ul>
        <p>
          <strong>Finalidades secundarias.</strong> Actualmente{" "}
          <strong>no realizamos tratamientos con finalidades secundarias</strong>. No enviamos boletines,
          publicidad ni comunicaciones de mercadotecnia a partir de los datos recabados en este sitio, ni
          elaboramos perfiles comerciales. Si en el futuro quisiéramos hacerlo, te lo informaríamos y
          solicitaríamos tu consentimiento de forma separada, específica y opcional, sin condicionar por
          ello la atención de tu solicitud.
        </p>
      </LegalSection>

      <LegalSection id="consentimiento" heading="4. Fundamento y consentimiento">
        <p>
          El tratamiento de tus datos se realiza conforme a la <strong>Ley Federal de Protección de
          Datos Personales en Posesión de los Particulares</strong> y demás disposiciones aplicables en
          México.
        </p>
        <p>
          Al proporcionarnos tus datos a través del formulario, WhatsApp, teléfono o correo, y al no
          manifestar oposición una vez puesto a tu disposición este aviso, entendemos que consientes su
          tratamiento para las finalidades primarias descritas. Como no recabamos datos sensibles,
          patrimoniales ni financieros, no se requiere consentimiento expreso y por escrito.
        </p>
      </LegalSection>

      <LegalSection id="transferencias" heading="5. Transferencias de datos">
        <p>
          <strong>No transferimos tus datos personales a terceros</strong> con fines distintos de los
          señalados en este aviso, ni los vendemos, rentamos o comercializamos de ninguna forma.
        </p>
        <p>
          Solo podríamos comunicarlos cuando exista un requerimiento fundado y motivado de una autoridad
          competente, o en los supuestos que la propia ley permite sin necesidad de tu consentimiento.
        </p>
      </LegalSection>

      <LegalSection id="encargados" heading="6. Proveedores que participan en el tratamiento">
        <p>
          Para operar el sitio nos apoyamos en proveedores tecnológicos que actúan como{" "}
          <strong>encargados</strong>: tratan los datos por cuenta nuestra y siguiendo nuestras
          instrucciones. Esto no constituye una transferencia. Los proveedores son:
        </p>
        <ul>
          <li>
            <strong>Netlify.</strong> Aloja el sitio y ejecuta las funciones que generan la cotización.
            En su servicio de almacenamiento se conserva el PDF de cada cotización junto con los datos
            que la acompañan: nombre de contacto, empresa, ubicación, teléfono, correo, fecha e importes.
          </li>
          <li>
            <strong>Proveedor de correo saliente (<LegalValue value={LEGAL.emailProvider} />).</strong>{" "}
            Entrega el mensaje con tu cotización adjunta a la dirección que nos indicaste.
          </li>
          <li>
            <strong>Google Fonts.</strong> Entrega las tipografías con las que se muestra el sitio. Por
            la naturaleza técnica de una petición web, este servicio recibe tu dirección IP al cargar la
            página. No instala cookies ni se emplea para identificarte o perfilarte.
          </li>
          <li>
            <strong>WhatsApp.</strong> Si eliges ese canal, la conversación se rige además por las
            políticas de privacidad de su titular, ajenas a nosotros.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="cookies" heading="7. Cookies y tecnologías de seguimiento">
        <p>
          <strong>Este sitio no utiliza cookies de analítica, publicidad, mercadotecnia ni de
          seguimiento de ningún tipo.</strong> No empleamos herramientas de estadísticas, píxeles de
          redes sociales, mapas ni videos incrustados de terceros.
        </p>
        <p>
          La única tecnología de almacenamiento que usamos es el <strong>almacenamiento local</strong>{" "}
          de tu propio navegador, con una finalidad estrictamente funcional: recordar los productos que
          agregaste a tu cotización para que no los pierdas si recargas la página. Esa información se
          queda en tu dispositivo, no viaja a nuestros servidores por sí sola y puedes eliminarla cuando
          quieras borrando los datos de navegación de tu navegador.
        </p>
        <p>
          Por no utilizar tecnologías de seguimiento, no mostramos un banner de consentimiento de
          cookies: no habría nada que consentir. Si en el futuro incorporáramos analítica o cualquier
          rastreador, actualizaríamos este aviso e implementaríamos el mecanismo de consentimiento que
          corresponda antes de activarlos.
        </p>
      </LegalSection>

      <LegalSection id="arco" heading="8. Tus derechos ARCO y cómo ejercerlos">
        <p>
          Tienes derecho a <strong>acceder</strong> a tus datos, <strong>rectificarlos</strong> si son
          inexactos, <strong>cancelarlos</strong> cuando consideres que no se requieren para las
          finalidades señaladas y <strong>oponerte</strong> a su tratamiento para fines específicos. Son
          los llamados derechos ARCO.
        </p>
        <p>
          También puedes <strong>revocar tu consentimiento</strong> en cualquier momento y{" "}
          <strong>limitar el uso o divulgación</strong> de tus datos, por ejemplo pidiéndonos que dejemos
          de contactarte con fines comerciales.
        </p>
        <p>
          Para ejercer cualquiera de estos derechos envía tu solicitud al correo{" "}
          <strong><LegalValue value={LEGAL.privacyEmail} /></strong> o preséntala en el domicilio
          indicado en el apartado 1. Tu solicitud debe incluir:
        </p>
        <ul>
          <li>Tu nombre y un medio para comunicarte la respuesta.</li>
          <li>Un documento que acredite tu identidad o, en su caso, la representación legal.</li>
          <li>La descripción clara de los datos y del derecho que deseas ejercer.</li>
          <li>Cualquier elemento que facilite localizar tus datos, como la fecha o el folio de tu cotización.</li>
        </ul>
        <p>
          Daremos respuesta en los plazos establecidos por la legislación aplicable, por el medio que nos
          hayas señalado. El ejercicio de estos derechos es gratuito; solo podrían cobrarse los gastos
          justificados de envío o reproducción.
        </p>
        <p>
          Si consideras que tu derecho a la protección de datos ha sido vulnerado, puedes acudir ante la
          autoridad competente en materia de protección de datos personales en México.
        </p>
      </LegalSection>

      <LegalSection id="conservacion" heading="9. Por cuánto tiempo conservamos tus datos">
        <p>
          Conservamos tus datos durante el tiempo necesario para cumplir las finalidades descritas y las
          obligaciones legales aplicables. El plazo de conservación de las cotizaciones y sus datos
          asociados es de <LegalValue value={LEGAL.retentionPeriod} />. Concluido ese periodo, los datos
          se bloquean previamente a su supresión.
        </p>
      </LegalSection>

      <LegalSection id="seguridad" heading="10. Medidas de seguridad">
        <p>
          Aplicamos medidas de seguridad administrativas, técnicas y físicas razonables para proteger tus
          datos contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado.
          Entre ellas, el sitio se transmite mediante conexión cifrada, el acceso a la información de
          cotizaciones se limita al personal que la necesita y los servicios que utilizamos operan bajo
          controles de acceso.
        </p>
        <p>
          Debes saber que <strong>ningún sistema, medio de transmisión ni medida de seguridad puede
          garantizar protección absoluta</strong>. Nos comprometemos a mantener esfuerzos razonables y
          actualizados, no a un resultado infalible.
        </p>
      </LegalSection>

      <LegalSection id="cambios" heading="11. Cambios a este aviso">
        <p>
          Este aviso puede modificarse para reflejar cambios en nuestros servicios, en las tecnologías
          que utilizamos o en la legislación aplicable. Cualquier modificación se publicará en esta misma
          página, <a href="/aviso-de-privacidad">{BUSINESS.web}/aviso-de-privacidad</a>, actualizando la
          fecha de última actualización que aparece al inicio del documento.
        </p>
        <p>
          Te sugerimos consultarla periódicamente. Cuando el cambio sea sustancial y afecte las
          finalidades del tratamiento, procuraremos comunicarlo además por el medio de contacto que nos
          hayas proporcionado.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
