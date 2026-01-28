// Type definitions for color settings
export interface ColorSettings {
    general?: {
        header?: {
            backgroundColor?: string;
            textColor?: string;
            borderColor?: string;
        };
        footer?: {
            backgroundColor?: string;
            textColor?: string;
            borderColor?: string;
        };
        navbar?: {
            backgroundColor?: string;
            textColor?: string;
            activeColor?: string;
            hoverColor?: string;
        };
    };
    buttons?: {
        primary?: {
            backgroundColor?: string;
            textColor?: string;
            hoverColor?: string;
        };
        secondary?: {
            backgroundColor?: string;
            textColor?: string;
            hoverColor?: string;
        };
    };
    pages?: {
        [pageName: string]: {
            [componentName: string]: {
                [property: string]: string;
            };
        };
    };
}
