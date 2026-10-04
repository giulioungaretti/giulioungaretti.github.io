import { education, experience } from '@/data/cv'

export function Cv() {
  return <CvRecords />
}

export function CvRecords() {
  return (
    <>
      <section className="cv-record" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-heading">
          Experience
        </h2>
        {experience.map((role) => (
          <article
            className="experience-row"
            key={`${role.company}-${role.dates}`}
          >
            <p className="experience-date">{role.dates}</p>
            <div>
              <h3 className="experience-company">{role.company}</h3>
              <p className="experience-title">{role.title}</p>
              <p className="experience-body">{role.description}</p>
            </div>
          </article>
        ))}
      </section>
      <div className="cv-end">
        <section aria-labelledby="education-heading">
          <h2 id="education-heading" className="section-heading">
            Education
          </h2>
          {education.map((item) => (
            <article className="education-item" key={item.degree}>
              <h3>{item.degree}</h3>
              <p>{item.dates}</p>
              <p>
                Thesis: {item.thesis}. {item.description}
              </p>
            </article>
          ))}
        </section>
        <section aria-labelledby="community-heading">
          <h2 id="community-heading" className="section-heading">
            Community
          </h2>
          <article className="education-item">
            <h3>PyData Copenhagen</h3>
            <p>Manager and organiser, 2014–2022.</p>
            <p>
              Grew it into the largest PyData community in the Nordics and
              taught workshops.
            </p>
          </article>
        </section>
      </div>
    </>
  )
}
