import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>切片</title>
      <defs>
        <filter colorInterpolationFilters="auto" id="filter-1">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
          />
        </filter>
        <path
          d="M11.7126563,5.51615625 C9.69834375,6.7190625 8.46253125,7.54875 8.0055,8.0055 L8.0055,8.0055 C7.45621875,8.55478125 7.45621875,9.44521875 8.0055,9.99421875 L8.0055,9.99421875 C8.55478125,10.5437812 9.44521875,10.5437812 9.9945,9.99421875 L9.9945,9.99421875 C10.45125,9.53746875 11.2809375,8.30165625 12.484125,6.28734375 L12.484125,6.28734375 C12.6430313,6.02071875 12.556125,5.67534375 12.2892188,5.51615625 L12.2892188,5.51615625 C12.2003438,5.46328125 12.1007813,5.4365625 12.0009375,5.4365625 L12.0009375,5.4365625 C11.9010938,5.4365625 11.8015313,5.46328125 11.7126563,5.51615625 L11.7126563,5.51615625 Z"
          id="path-2"
        />
      </defs>
      <g id="0626修改" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="rw-reward" transform="translate(-29.000000, -2085.000000)">
          <g id="编组-15" transform="translate(0.000000, 2074.000000)">
            <g id="编组-18" transform="translate(12.000000, 10.999926)">
              <g id="icon/1" transform="translate(0.000000, 0.000074)" filter="url(#filter-1)">
                <g transform="translate(17.000000, 0.000000)">
                  <path
                    d="M0,9 C0,13.9705313 4.02946875,18 9,18 L9,18 C13.9705313,18 18,13.9705313 18,9 L18,9 C18,4.0291875 13.9705313,0 9,0 L9,0 C4.02946875,0 0,4.0291875 0,9 L0,9 Z M3.45909375,9.01659375 C3.4239375,9.01603125 3.38934375,9.01321875 3.35475,9.0084375 L3.35475,9.0084375 C2.9098125,8.9454375 2.595375,8.54634375 2.63165625,8.1039375 L2.63165625,8.1039375 L2.63728125,8.055 L2.65471875,7.93490625 C2.725875,7.4638125 2.8108125,7.0914375 2.9086875,6.8180625 L2.9086875,6.8180625 C3.80390625,4.318875 6.193125,2.53125 9,2.53125 L9,2.53125 C11.8096875,2.53125 14.2014375,4.32253125 15.0944062,6.8259375 L15.0944062,6.8259375 C15.1995937,7.12040625 15.2890312,7.5301875 15.363,8.05528125 L15.363,8.05528125 C15.3680625,8.08959375 15.370875,8.12446875 15.3712791,8.15934375 L15.3712791,8.15934375 C15.37875,8.60821875 15.033375,8.9814375 14.5909687,9.01434375 L14.5909687,9.01434375 L14.5414687,9.01659375 C13.7033437,9.02475 13.0750312,9.03065625 12.6559687,9.034875 L12.6559687,9.034875 C12.4922812,9.0365625 12.2751562,9.03853125 12.0040312,9.0410625 L12.0040312,9.0410625 C11.7379687,9.043875 11.5095937,9.232875 11.4575625,9.493875 L11.4575625,9.493875 C11.4021562,9.77428125 11.3369062,9.98859375 11.262375,10.1368125 L11.262375,10.1368125 C10.8455625,10.9639687 9.98915625,11.53125 9,11.53125 L9,11.53125 C8.01590625,11.53125 7.16315625,10.969875 6.744375,10.1500312 L6.744375,10.1500312 C6.66421875,9.99253125 6.59559375,9.76415625 6.53934375,9.4635 L6.53934375,9.4635 C6.489,9.19546875 6.2533125,9.00225 5.98078125,9.0050625 L5.98078125,9.0050625 C5.72821875,9.00759375 5.52459375,9.00984375 5.3701875,9.01125 L5.3701875,9.01125 C5.07009375,9.01434375 4.62009375,9.01884375 4.01990625,9.0253125 L4.01990625,9.0253125 L3.45909375,9.01659375 Z"
                    id="Clip-2"
                    fill="#000000"
                  />
                  <mask id="mask-3" fill="white">
                    <use xlinkHref="#path-2" />
                  </mask>
                  <use id="Clip-4" fill="#000000" opacity="0.6" xlinkHref="#path-2" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Icon;