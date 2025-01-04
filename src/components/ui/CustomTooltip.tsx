import {useState} from "react";
import {InfoIcon} from "lucide-react";

export const CustomTooltip = (props: { children: any, content: any }) => {
    let {children, content} = props;
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-flex items-center gap-1 cursor-help group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <InfoIcon className="h-4 w-4 text-gray-400"/>

            {isVisible && (
                <div
                    className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 text-sm text-gray-200 rounded-lg shadow-lg z-50">
                    {content}
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 rotate-45"/>
                </div>
            )}
        </div>
    );
};
