import classNames from 'classnames'
import { useDeviceSize } from 'contexts'
import { useActiveSection } from './use-active-section'
import { SidecarHeading } from './types'
import s from './style.module.css'

interface SidecarProps {
  headings: SidecarHeading[]
}

const SIDECAR_LABEL_ELEMENT_ID = 'sidecar-label'

const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  const { isDesktop } = useDeviceSize()
  const activeSection = useActiveSection(headings, isDesktop)

  const renderListItem = ({ level, slug, title }, idx) => {
    if (level > 2) {
      return null
    }

    const isActive = slug === activeSection
    const className = classNames(s.sidecarListItem, {
      [s.activeSidecarListItem]: isActive,
    })

    return (
      <li className={className} key={slug}>
        <a className={s.sidecarListItemAnchor} href={`#${slug}`}>
          {idx == headings.length - 1
            ? title + ' additional infrastructure'
            : title}
        </a>
        {isActive && <span aria-hidden className={s.activeIndicator} />}
      </li>
    )
  }

  return (
    <nav
      aria-labelledby={SIDECAR_LABEL_ELEMENT_ID}
      className={`${s.sidecar} hide-on-mobile hide-on-tablet`}
    >
      <p className={s.sidecarLabel} id={SIDECAR_LABEL_ELEMENT_ID}>
        On this page
      </p>
      <ol className={s.sidecarList}>{headings.map(renderListItem)}</ol>
    </nav>
  )
}

export default Sidecar
