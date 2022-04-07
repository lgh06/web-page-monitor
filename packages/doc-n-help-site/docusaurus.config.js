// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

var baseUrl = process.env.DOCU_BASE_URL || '/webpagemonitor_doc_site/';

/** @type {import('@docusaurus/types').Config} */
var config = {
  title: 'Web Page Monitor 网页变动检测',
  tagline: 'Web Site Page Changes Monitor,Cloud watch web updates.网站网页页面更新变更监控提醒，云端监控网页变动更新',
  url: 'https://webpagemonitor.net',
  baseUrl: baseUrl,
  trailingSlash: true,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon.ico',
  organizationName: 'lgh06', // Usually your GitHub org/user name.
  projectName: 'web-page-monitor', // Usually your repo name.

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: ({locale, docPath}) => {
            if (locale !== 'en') {
              return `https://github.com/lgh06/web-page-monitor/tree/main/packages/doc-n-help-site/i18n/zh/docusaurus-plugin-content-docs/current/${docPath}`;
            }
            return `https://github.com/lgh06/web-page-monitor/tree/main/packages/doc-n-help-site/docs/${docPath}`;
          },
          breadcrumbs: true,
          // sidebarCollapsed: true,
          routeBasePath:'/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        // blog: {
          // showReadingTime: true,
          // Please change this to your repo.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
          // autoCollapseSidebarCategories: false,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Web Page Monitor',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Docs',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: 'localeDropdown',
            position: 'right',
            // dropdownItemsAfter: [
            //   {
            //     href: 'https://github.com/lgh06/web-page-monitor/issues/3526',
            //     label: 'Help Us Translate',
            //   },
            // ],
          },
          {
            href: 'https://webpagemonitor.net',
            label: 'Product Home',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Links',
            items: [
              {
                label: 'Product Home',
                to: 'https://webpagemonitor.net',
              },
              {
                label: 'Docs',
                to: '/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/webpagemonitor',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/lgh06/web-page-monitor',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} webpagemonitor.net `,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      hideableSidebar: true,
    }),

  scripts: [
    // String format.
    // 'https://docusaurus.io/script.js',
    // Object format.
    {
      src: baseUrl + 'js/wpmt_doc_global_analyze.js',
      async: true,
    },
    {
      src: baseUrl + 'js/switch_hint.js?' + Math.floor(Date.now() / 1000 / 3600 / 24 / 7),
      async: true,
    },
  ],
};

module.exports = config;
