/**
 * capability layer  answers questions like:
        Can the user jump to an arbitrary page?
        Can they use keyboard navigation?
        Can they scroll continuously?
        Can they select text / copy?
        Can they download?
 
This Layer is the only source of the truth of these questions. 
*/

import type { AccessMode } from "../../../types/reader.types";


export function deriveReaderCapabilities(
    accessMode: AccessMode,
    currentPage: number,
    maxAllowedPage: number
) {
    return {
        canGoPrev: currentPage > 1,
        canGoNext: currentPage < maxAllowedPage,

        canJumpToPage: accessMode === "FULL",
        canUseKeyboard: true,

        canScroll: accessMode === "FULL",
    }
}