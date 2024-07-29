import { extendTheme } from "@chakra-ui/react";
import { Global } from "@emotion/react";



const Fonts = () => (
    <Global
        styles={`
      @font-face {
        font-family: 'GmkBold';
        font-weight: 400;
        font-display: swap;
        src: url("/fonts/GmarketSansTTFBold.ttf");
      }

      @font-face {
        font-family: 'GmkMedium';
        font-weight: 400;
        font-display: swap;
        src: url("/fonts/GmarketSansTTFMedium.ttf");
      }

      @font-face {
        font-family: 'GmkLight';
        font-weight: 200;
        font-display: swap;
        src: url("/fonts/GmarketSansTTFLight.ttf");
      }

      @font-face {
        font-family: 'FooterLight';
        font-weight: 100;
        font-display: swap;
        src: url("/fonts/GmarketSansTTFMedium.ttf");
      }
    `}
    />
);

const primary = {
    ourgreen: "#126F54",
    ourred: "#E34140",
    ourwhite: "#FFFAF4",
    ourlightgreen: "#C1D8B5",
    ourpink: " #FFF0DD",
};

const utility = {
    greenfont: "#0E3E30",
    darkBG: "#000000",
};


const activeLabelStyles = {
    transform: "scale(0.85) translateY(-24px)",
};

const Theme = extendTheme({
    components: {
        Form: {
            variants: {
                floating: {
                    container: {
                        _focusWithin: {
                            label: {
                                ...activeLabelStyles,
                            },
                        },
                        "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
                            {
                                ...activeLabelStyles,
                            },
                        label: {
                            top: 0,
                            left: 0,
                            zIndex: 2,
                            position: "absolute",
                            backgroundColor: "white",
                            pointerEvents: "none",
                            mx: 3,
                            px: 1,
                            my: 2,
                            transformOrigin: "left top",
                        },
                    },
                },
            },
        },
    },

    colors: {
        themeGreen: {
            500: primary.ourgreen,
            // 50: "#e9fcf6",
            600: utility.greenfont,
        },
        themeRed: { 500: primary.ourred },
        themeWhite: { 500: primary.ourwhite },
        themeLightGreen: { 500: primary.ourlightgreen },
        themePink: { 500: primary.ourpink },
        themeFontGreen: { 500: utility.greenfont },
    },
    styles: {
        global: {
            body: {
                fontFamily: "GmkLight",
            },
            footer: {
                fontFamily: "FooterLight",
            },
            html: {
                fontFamily: "GmkLight",
            },
        },
    },
});

export { Theme, Fonts };