import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.diffusionswap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/diffusionswap",
      },
      {
        label: "Community",
        href: "https://docs.diffusionswap.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.diffusionswap.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://diffusionswap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.diffusionswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.diffusionswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.diffusionswap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/diffusionswap",
      },
      {
        label: "Documentation",
        href: "https://docs.diffusionswap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@diffusionswap-1/s/diffusionswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.diffusionswap.finance/help/faq#is-diffusionswap-safe-has-diffusionswap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.diffusionswap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/diffusionswap",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/diffusionswap",
      },
      {
        label: "中文",
        href: "https://t.me/TomoSwap_CN",
      },
      {
        label: "繁體",
        href: "https://t.me/TomoSwap_TW",
      },
      {
        label: "日本語",
        href: "https://t.me/tomoswapjp",
      },
      {
        label: "한국어",
        href: "https://t.me/tomoswapko",
      },
    ],
  },
 
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
