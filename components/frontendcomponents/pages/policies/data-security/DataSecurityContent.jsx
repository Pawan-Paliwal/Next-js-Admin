import Image from "next/image";
import React from "react";

const DataSecurityContent = () => {
  return (
    <section className="bg-background pt-16" id="policies">
      <div className="container">
        <div className="mx-auto max-w-[836px]">
          <p>
            At{' '}
            <span className="text-primary font-semibold">Chanderpur Group</span>
            , we are committed to protecting personal and organizational data
            while ensuring transparency and compliance with data protection
            regulations.
          </p>

          <ul className="border-primary mt-8 border-l pb-16">
            {data?.map(({ icon, content }, i) => {
              return (
                <li
                  key={i}
                  className="before:bg-primary relative flex  gap-7 pl-8 not-first:mt-10 before:absolute before:top-8 before:-left-2 before:size-[14px] before:rounded-full before:content-['']"
                >
                  <figure className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#D4F2FF_0%,#F0FBFF_100%)]">
                    <Image src={icon} alt="" width={30} height={30} />
                  </figure>

                  <figcaption
                    className="[&_h4]:text-gray [&_h4]:mb-2 [&_h4]:font-semibold [&_li]:pl-6 [&_li]:relative [&_li]:before:bg-[url('/icon/right-blue-small.svg')] [&_li]:not-first:mt-3 [&_li]:before:absolute [&_li]:before:top-1.5 [&_li]:before:left-0  [&_li]:before:h-[13px] [&_li]:before:w-[7px] [&_li]:before:content-[''] [&_li]:"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DataSecurityContent;

const data = [
  {
    icon: "/icon/target.svg",
    content: `
      <h4>Purpose</h4>
      <p>Establish secure methods for handling, storing, and transmitting confidential data to prevent breaches and protect stakeholder trust.</p>
    `,
  },
  {
    icon: "/icon/target-linear.svg",
    content: `
      <h4>Scope</h4>
      <p>Establish secure methods for handling, storing, and transmitting confidential data to prevent breaches and protect stakeholder trust.</p>
    `,
  },
  {
    icon: "/icon/approval-delegation.svg",
    content: `
      <h4>Consent</h4>
      <p>By using our website, users agree to this policy.</p>
    `,
  },
  {
    icon: "/icon/majesticons.svg",
    content: `
      <h4>Information We Collect</h4>
      <ul>
        <li>Establish secure methods for handling, storing, and transmitting confidential data to prevent breaches and protect stakeholder trust.</li>
        <li>Data from forms or direct communication</li>
        <li>Technical data (IP address, browser, usage patterns)</li>
      </ul>
    `,
  },
  {
    icon: "/icon/outline_setting.svg",
    content: `
      <h4>Use of Information</h4>
      <ul>
        <li>Enhance user experience</li>
        <li>Communicate updates and support users</li>
        <li>Marketing and fraud prevention</li>
      </ul>
    `,
  },
  {
    icon: "/icon/shield_value.svg",
    content: `
      <h4>Data Security Measures</h4>
      <ul>
        <li>Access controls and encryption</li>
        <li>Regular monitoring and audits</li>
        <li>Incident response systems</li>
      </ul>
    `,
  },
  {
    icon: "/icon/cookie.svg",
    content: `
      <h4>Cookies & Log Files</h4>
      <p>Used for analytics and performance; third parties like Google may use cookies.</p>
    `,
  },
  {
    icon: "/icon/note_shield.svg",
    content: `
      <h4>Third-Party Policies</h4>
      <p>Not covered under our policy—users should review them separately.</p>
    `,
  },
  {
    icon: "/icon/check_user.svg",
    content: `
      <h4>User Rights (CCPA & GDPR)</h4>
      <ul>
        <li>Access, update, or delete data</li>
        <li>Restrict or object to processing</li>
        <li>Data portability</li>
      </ul>
    `,
  },
  {
    icon: "/icon/child.svg",
    content: `
      <h4>Children’s Data</h4>
      <p>We do not knowingly collect data from children under 13.</p>
    `,
  },
  {
    icon: "/icon/new_users.svg",
    content: `
      <h4>Employee Responsibility</h4>
      <p>Regular training ensures proper data handling and security awareness.</p>
    `,
  },
  {
    icon: "/icon/watch_reload.svg",
    content: `
      <h4>Policy Updates</h4>
      <p>Updated periodically to reflect legal and technological changes.</p>
    `,
  },
];