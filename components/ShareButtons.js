"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";

export default function ShareButtons({ url }) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <FacebookShareButton url={url}>
        <FacebookIcon size={28} round />
      </FacebookShareButton>

      <TwitterShareButton url={url}>
        <TwitterIcon size={28} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url}>
        <WhatsappIcon size={28} round />
      </WhatsappShareButton>

      <TelegramShareButton url={url}>
        <TelegramIcon size={28} round />
      </TelegramShareButton>
    </div>
  );
}
