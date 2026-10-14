import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import EmisijeLista from "@/components/EmisijeLista";
import DvbRegije from "@/components/DvbRegije";
import { DarkTile, PillButton, UnderlineLink } from "@/components/Tiles";
import { ClapperIcon, KiteIcon, MicIcon, NoteIcon } from "@/components/StatIcons";
import { produkcija } from "@/content/program";
import { dvbRegije, opisEmisije, programskaShema } from "@/server/sadrzaj";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Federalna televizija",
  description:
    "Federalna televizija (FTV): programske cjeline, emisije i termini, digitalni prijem DVB-T2 u Multipleksu A.",
};

const ikone = [MicIcon, NoteIcon, ClapperIcon, KiteIcon];

export default function TelevizijaPage() {
  const shema = programskaShema().map((e) => ({ naziv: e.naziv, slug: e.slug, termin: e.termin, vrsta: e.vrsta, opis: opisEmisije(e) }));
  return (
    <>
      <PageHero
        eyebrow="Televizija"
        title="Federalna"
        highlight="televizija"
        lead="Prvi Dnevnik emitovan je 27. oktobra 2001. godine. Od tada Federalna televizija donosi informativni, dokumentarni, zabavni, sportski i program za djecu i mlade – gledaocima u cijeloj Bosni i Hercegovini."
        crumbs={[{ label: "Televizija" }]}
        actions={
          <>
            <PillButton href="#emisije">Programska shema</PillButton>
            <UnderlineLink href={site.external.teletext} external>
              TV program na Teletekstu
            </UnderlineLink>
          </>
        }
        stats={[
          { value: "2001.", label: "prvi Dnevnik, 27. oktobra" },
          { value: shema.length, label: "emisija u programu" },
          { value: "19:30", label: "Dnevnik 2, svakog dana" },
          { value: dvbRegije().length, label: "DVB-T2 regija" },
        ]}
      />

      <Section
        eyebrow="Produkcija RTVFBiH"
        title="Programske cjeline"
        lead="Četiri redakcije Odjela za TV program pripremaju program za sve generacije."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {produkcija.map((p, i) => (
            <DarkTile key={p.naziv} icon={ikone[i]} title={p.naziv} text={p.opis} className="min-h-[13rem]" />
          ))}
        </div>
      </Section>

      <Section
        id="emisije"
        tone="mist"
        eyebrow="Programska shema"
        title="Emisije i termini"
        lead="Aktuelne emisije Federalne televizije, poredane po vremenu emitovanja. Dnevni TV program dostupan je na Teletekstu i portalu federalna.ba."
        className="scroll-mt-16"
        actions={<PillButton href="/televizija/emisije">Sve emisije i serije</PillButton>}
      >
        <EmisijeLista emisije={shema} />
      </Section>

      <Section
        eyebrow="Prijem signala"
        title="Digitalna zemaljska televizija DVB-T2"
        lead="Federalna televizija emitira se u Multipleksu A u HD rezoluciji. Usmjerite antenu prema najbližoj emisionoj lokaciji i pokrenite pretragu kanala."
        actions={
          <UnderlineLink href="/frekvencije" dark={false}>
            Sve frekvencije i upute
          </UnderlineLink>
        }
      >
        <DvbRegije />
      </Section>
    </>
  );
}
