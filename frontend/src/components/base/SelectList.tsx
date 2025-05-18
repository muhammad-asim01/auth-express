import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { BodyText } from "./typography/BodyText";

interface SelectBlockProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export const SelectList: React.FC<SelectBlockProps> = ({
    label,
    options,
    value,
    onChange,
}) => {
    return (
        <div className="space-y-2">
            <BodyText variant="body4" className="text-font4">
                {label}
            </BodyText>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    className="h-12 w-full border border-font4/20 rounded-md px-3 shadow-none focus:ring-0 focus:outline-none"
                >
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent
                    className="border border-font4/20 rounded-md shadow-md"
                >
                    {options.map((option) => (
                        <SelectItem
                            key={option}
                            value={option}
                            className="cursor-pointer hover:bg-muted px-3 py-2"
                        >
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
