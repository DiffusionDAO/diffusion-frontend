import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <title>切片</title>
        <defs>
            <filter colorInterpolationFilters="auto" id="filter-1">
                <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0" />
            </filter>
        </defs>
        <g id="切图" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-766.000000, -1811.000000)" id="icon/1" filter="url(#filter-1)">
                <g transform="translate(766.000000, 1811.000000)">
                    <path d="M14.9744095,14.9995316 L14.9744095,14.9995316 C14.9741379,15.4326349 14.9741379,16.0826839 14.9741379,16.9494158 C14.9741379,17.5296009 14.4877888,18 13.887931,18 C13.6842672,18 13.4849483,17.9445817 13.3122414,17.8400486 C12.6246724,17.4245425 12.1087241,17.1127817 11.7649397,16.9050287 C11.7402284,16.8900578 11.7141595,16.8745617 11.6875474,16.858015 C11.4113793,16.6912348 11.3274698,16.3398144 11.4999052,16.0727033 C11.5729526,15.9600282 11.6840172,15.8754562 11.8143621,15.8336954 C12.5467371,15.5991525 13.2370216,15.2758353 13.8713664,14.8763506 C13.9729267,14.8127903 14.0902371,14.7324206 14.2241121,14.6357668 C14.4318491,14.485796 14.7259397,14.5267687 14.8809957,14.727693 C14.9415517,14.8062241 14.9744095,14.9015646 14.9744095,14.9995316 M6.39744828,16.8070617 C6.34775431,16.8370033 6.30159052,16.8651065 6.25841379,16.8908458 C5.90946983,17.1017505 5.3859181,17.418239 4.68775862,17.8400486 C4.17914224,18.1476071 3.50895259,17.9981615 3.19096552,17.5062254 C3.08288793,17.3391826 3.02586207,17.1461377 3.02586207,16.9494158 C3.02586207,16.106322 3.02586207,15.4743957 3.02586207,15.0525861 C3.02586207,14.7865257 3.24853448,14.5708933 3.52388793,14.5708933 C3.63033621,14.5708933 3.73406897,14.6039867 3.81987931,14.6654458 C3.96488793,14.7689284 4.09197414,14.8542884 4.20140948,14.9217884 C4.81321552,15.2986855 5.47553017,15.605456 6.17613362,15.8305437 C6.20546121,15.8399989 6.23668966,15.8497169 6.26954741,15.8594348 C6.55630603,15.9450574 6.7167931,16.2392209 6.62853879,16.5163125 C6.58997845,16.636867 6.50796983,16.7400869 6.39744828,16.8070617" id="Fill-1" fillOpacity="0.6" fill="#000000" />
                    <path d="M9,0 C13.349444,0 16.875,3.41019621 16.875,7.61673522 C16.875,11.8235369 13.349444,15.2334704 9,15.2334704 C4.65082759,15.2334704 1.125,11.8235369 1.125,7.61673522 C1.125,3.41019621 4.65082759,0 9,0 M9.31337069,4.68350422 C9.06870259,4.51593605 8.72953448,4.5721423 8.55655603,4.80904903 L8.00096121,5.56914668 C7.82852586,5.80500282 7.58032759,5.9793998 7.29519828,6.06502241 L6.37599569,6.34132604 C6.31734052,6.35892333 6.26194397,6.38623851 6.21252155,6.42195838 C5.97219828,6.59530476 5.92250431,6.92440026 6.102,7.15710465 L6.67768966,7.90301941 C6.85637069,8.13441057 6.95114224,8.41649242 6.94734052,8.70540307 L6.93512069,9.63595799 C6.93430603,9.69584129 6.94381034,9.7551993 6.96363362,9.8116682 C7.06003448,10.086396 7.36851724,10.2334777 7.65256034,10.1402384 L8.56388793,9.8413472 C8.84684483,9.7483705 9.15315517,9.7483705 9.43611207,9.8413472 L10.3474397,10.1402384 C10.4060948,10.1596742 10.467194,10.1688668 10.5291078,10.1680789 C10.8289009,10.1644018 11.0689526,9.92618187 11.0648793,9.63595799 L11.0526595,8.70540307 C11.0488578,8.41649242 11.1436293,8.13441057 11.3223103,7.90301941 L11.898,7.15710465 C11.934931,7.10904042 11.9629009,7.05572328 11.9813664,6.99872908 C12.0704353,6.72163751 11.9102198,6.4272113 11.6237328,6.34132604 L10.7048017,6.06502241 C10.4196724,5.9793998 10.1714741,5.80500282 9.99903879,5.56914668 L9.44344397,4.80904903 C9.40787069,4.76019687 9.36387931,4.71764821 9.31337069,4.68350422" id="Fill-3" fill="#000000" />
                </g>
            </g>
        </g>
    </svg>
  );
};

export default Icon;
