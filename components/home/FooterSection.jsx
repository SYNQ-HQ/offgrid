"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";

export default function FooterSection() {
  return (
    <footer className="bg-black py-24 md:py-32 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16"
        >
          <div>
            <h3 className="text-[#F5EDE4] text-4xl md:text-5xl font-extralight mb-6">
              {/* OFFeGRID*/}
              <svg
                width="222"
                height="87"
                viewBox="0 0 522 87"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M501.966 4.96606C508.212 8.27916 513.046 12.9242 516.471 18.9077C519.894 24.8899 521.608 31.7955 521.608 39.6218C521.608 47.3731 519.896 54.2606 516.471 60.2803C513.047 66.3013 508.193 70.9683 501.909 74.2775C495.624 77.5906 488.344 79.246 480.066 79.246H450.378V0.000489038H480.066C488.42 -0.000804131 495.719 1.65425 501.966 4.96606ZM495.87 56.5533C499.934 52.5664 501.966 46.9218 501.966 39.6205C501.966 32.3219 499.934 26.6385 495.87 22.5754C491.806 18.511 486.123 16.4792 478.825 16.4792H469.681V62.5355H478.825C486.123 62.5368 491.807 60.544 495.87 56.5533Z"
                  fill="white"
                />
                <path
                  d="M442.844 0.000488281V79.246H423.542V0.000488281H442.844Z"
                  fill="white"
                />
                <path
                  d="M326.296 35.6149C326.299 35.6343 326.3 35.6551 326.303 35.6758H301.576V49.9007H325.21C324.261 52.6836 322.836 55.1263 320.933 57.2316C317.129 61.4538 312.071 63.5541 305.75 63.5541C299.35 63.5541 294.259 61.4654 290.455 57.2884C286.65 53.1128 284.753 47.5238 284.753 40.5252C284.753 33.458 286.65 27.8481 290.455 23.7061C294.258 19.5744 299.349 17.4963 305.75 17.4963C312.073 17.4963 317.129 19.5838 320.933 23.762C321.621 24.5301 322.254 25.3305 322.831 26.1892H343.917C343.128 23.9197 342.122 21.742 340.915 19.6419C337.336 13.4787 332.449 8.65889 326.239 5.1932C320.031 1.73914 313.202 0 305.75 0C298.3 0 291.471 1.73914 285.263 5.1932C279.054 8.65889 274.121 13.4787 270.474 19.6419C266.828 25.8155 265 32.7817 265 40.5252C265 48.2803 266.828 55.2569 270.474 61.4641C274.121 67.6739 279.053 72.5155 285.263 75.9709C291.471 79.4366 298.302 81.1644 305.75 81.1644C313.202 81.1644 320.008 79.4366 326.182 75.9709C332.357 72.5155 337.245 67.6739 340.857 61.4641C344.469 55.2556 346.276 48.2803 346.276 40.5252C346.276 38.8544 346.197 37.2171 346.027 35.6149H326.296Z"
                  fill="white"
                />
                <path
                  d="M410.874 39.0567C413.845 34.9198 415.332 30.2154 415.332 24.9458C415.332 20.2813 414.24 16.0474 412.058 12.2468C409.875 8.44743 406.584 5.45638 402.181 3.27351C397.779 1.09064 392.453 0.000488281 386.207 0.000488281H353.81V25.044H373.113V14.8394H385.079C388.614 14.8394 391.268 15.7046 393.037 17.4362C394.803 19.1677 395.689 21.5394 395.689 24.5473C395.689 27.7079 394.803 30.1559 393.037 31.8849C391.268 33.6177 388.614 34.4816 385.079 34.4816H375.407H373.114H353.811V79.2447H373.114V49.3297H377.741L394.222 79.2447H416.01L397.722 47.862C403.515 46.1317 407.899 43.1961 410.874 39.0567Z"
                  fill="white"
                />
                <path
                  d="M225.319 41.249H206.016V86.2463H225.319V64.892V55.4922H249.477V41.3137H225.319V41.249Z"
                  fill="white"
                />
                <path
                  d="M206.016 7V31.7745H225.319V27.9622V22.4663H257.604V7H206.016Z"
                  fill="white"
                />
                <path
                  d="M166.198 41.2495H146.894V86.2468H166.198V64.8925V55.4927H190.355V41.3142H166.198V41.2495Z"
                  fill="white"
                />
                <path
                  d="M146.895 7.00098V31.7755H166.198V27.9632V22.4672H198.483V7.00098H146.895Z"
                  fill="white"
                />
                <rect
                  y="7.00195"
                  width="135.543"
                  height="77.0978"
                  rx="37.4669"
                  fill="#FEFFFF"
                />
                <rect
                  x="60.6609"
                  y="11.6191"
                  width="67.7972"
                  height="67.7972"
                  rx="33.8986"
                  fill="#FF5500"
                />
              </svg>
            </h3>
            <p className="text-[#F5EDE4]/40 text-sm font-light max-w-md leading-relaxed">
              A private IRL culture event for tech builders to unplug, unwind,
              and connect beyond screens.
            </p>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <div className="space-y-6 mb-8 md:mb-0">
              <div>
                <p className="text-[#F5EDE4]/30 text-xs tracking-[0.2em] mb-3">
                  PAGES
                </p>
                <div className="flex flex-col gap-3 md:items-end">
                  <Link
                    href={createPageUrl("Blog")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Blog
                  </Link>
                  <Link
                    href={createPageUrl("Contact")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[#F5EDE4]/30 text-xs tracking-[0.2em] mb-3">
                  SHOP
                </p>
                <div className="flex gap-6 md:justify-end">
                  <Link
                    href={createPageUrl("Merch")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Store
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[#F5EDE4]/30 text-xs tracking-[0.2em] md:text-right mb-3">
                  LEGAL
                </p>
                <div className="flex gap-6 md:justify-end">
                  <Link
                    href={createPageUrl("Terms")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Terms
                  </Link>
                  <Link
                    href={createPageUrl("Privacy")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Privacy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-[#F5EDE4]/20 text-xs">
            © {new Date().getFullYear()} OffGrid. All rights reserved.
          </p>
          <p className="text-[#F5EDE4]/20 text-xs">
            Not loud. Not everywhere. Just intentional.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
