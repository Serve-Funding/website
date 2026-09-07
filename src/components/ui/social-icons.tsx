'use client'

import { Linkedin, Facebook } from 'lucide-react'
import { SocialIcon } from './social-icon'

export function SocialIcons() {
  return (
    <div className="flex gap-4">
      <SocialIcon
        href="https://www.linkedin.com/company/serve-funding"
        icon={Linkedin}
        label="LinkedIn"
      />
      <SocialIcon
        href="https://www.facebook.com/ServeFunding"
        icon={Facebook}
        label="Facebook"
      />
    </div>
  )
}
