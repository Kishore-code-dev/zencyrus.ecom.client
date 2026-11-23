import {
    useRef,
    useState,
    useMemo,
    useCallback,
    type ComponentProps,
    memo,
} from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const TRIM_INSET = 2;
const SAFE_INSET = 4;
const MM_TO_PX = 96 / 25.4;
const DIALOG_CANVAS_W = 480;
const DIALOG_CANVAS_H = 520;

const COLOR_BLEED = "hsl(0, 85%, 55%)";
const COLOR_TRIM = "hsl(145, 75%, 42%)";
const COLOR_SAFE = "hsl(220, 85%, 55%)";

const PreviewContent = memo(function PreviewContent({
    fileUrl,
}: {
    fileUrl: string;
    width: number;
    height: number;
}) {
    return (
        <img
            loading="lazy"
            decoding="async"
            src={fileUrl}
            alt="design preview"
            style={{ objectFit: "contain", height: "100%", width: "100%" }}
            draggable={false}
        />
    );
});

// ── Guide overlay ───────────────────────────────────────────────────────────
function GuideOverlay({ inset, color }: { inset: number; color: string }) {
    return (
        <div
            style={{
                position: "absolute",
                top: inset,
                left: inset,
                right: inset,
                bottom: inset,
                border: `1.5px dashed ${color}`,
                boxSizing: "border-box",
                pointerEvents: "none",
                zIndex: 10,
            }}
        />
    );
}

interface DesignFilePreviewProps extends ComponentProps<"div"> {
    documentHeightInPx: number;
    documentHeightInMM: number;
    documentWidthInPx: number;
    documentWidthInMM: number;
    cellCount: number;
    colorSpace: string;
    fileType: string;
    imageUrl: string;
    isPdf?: boolean;
}

export default function DesignFilePreview({
    fileType,
    cellCount,
    colorSpace,
    documentHeightInMM,
    documentWidthInMM,
    documentHeightInPx,
    documentWidthInPx,
    imageUrl,
    isPdf = false,
    ...props
}: DesignFilePreviewProps) {
    // ── Derived layout values ───────────────────────────────────────────────
    const { fitScale, baseW, baseH, trimPx, safePx } = useMemo(() => {
        const containerW = documentWidthInMM * MM_TO_PX;
        const containerH = documentHeightInMM * MM_TO_PX;
        const fitScale = Math.min(
            DIALOG_CANVAS_W / containerW,
            DIALOG_CANVAS_H / containerH,
        );
        const baseW = containerW * fitScale;
        const baseH = containerH * fitScale;
        const trimPx = TRIM_INSET * MM_TO_PX * fitScale;
        const safePx = SAFE_INSET * MM_TO_PX * fitScale;
        return { fitScale, baseW, baseH, trimPx, safePx };
    }, [documentWidthInMM, documentHeightInMM]);

    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
    const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    // ── Helpers ─────────────────────────────────────────────────────────────
    const clampPan = useCallback(
        (x: number, y: number, z: number) => {
            const maxX = (baseW * (z - 1)) / 2;
            const maxY = (baseH * (z - 1)) / 2;
            return {
                x: Math.min(maxX, Math.max(-maxX, x)),
                y: Math.min(maxY, Math.max(-maxY, y)),
            };
        },
        [baseW, baseH],
    );

    const applyZoom = useCallback((next: number) => {
        const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +next.toFixed(2)));
        setZoom(z);
        if (z === 1) setPan({ x: 0, y: 0 });
        return z;
    }, []);

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    // ── Zoom controls ────────────────────────────────────────────────────────
    const handleZoomIn = useCallback(
        () => applyZoom(zoom + ZOOM_STEP),
        [applyZoom, zoom],
    );
    const handleZoomOut = useCallback(
        () => applyZoom(zoom - ZOOM_STEP),
        [applyZoom, zoom],
    );
    const handleSliderChange = useCallback(
        (val: number[]) => applyZoom(val[0]),
        [applyZoom],
    );

    // ── Mouse pan ────────────────────────────────────────────────────────────
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (zoom <= 1) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                panX: pan.x,
                panY: pan.y,
            };
        },
        [zoom, pan],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            setPan(
                clampPan(
                    dragStart.current.panX + dx,
                    dragStart.current.panY + dy,
                    zoom,
                ),
            );
        },
        [isDragging, zoom, clampPan],
    );

    const handleMouseUp = useCallback(() => setIsDragging(false), []);
    const handleMouseLeave = useCallback(() => setIsDragging(false), []);

    // ── Ctrl+scroll zoom ─────────────────────────────────────────────────────
    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            applyZoom(zoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
        },
        [zoom, applyZoom],
    );

    // ── Double-click: zoom in or reset ───────────────────────────────────────
    const handleDoubleClick = useCallback(() => {
        zoom >= MAX_ZOOM ? resetView() : applyZoom(zoom + ZOOM_STEP * 2);
    }, [zoom, resetView, applyZoom]);

    // ── Touch pan & pinch-to-zoom ────────────────────────────────────────────
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                pinchStart.current = {
                    dist: Math.sqrt(dx * dx + dy * dy),
                    zoom,
                };
            } else if (e.touches.length === 1 && zoom > 1) {
                const t = e.touches[0];
                dragStart.current = {
                    x: t.clientX,
                    y: t.clientY,
                    panX: pan.x,
                    panY: pan.y,
                };
            }
        },
        [zoom, pan],
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 2 && pinchStart.current) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                applyZoom(
                    pinchStart.current.zoom * (dist / pinchStart.current.dist),
                );
            } else if (e.touches.length === 1 && zoom > 1) {
                const t = e.touches[0];
                const dx = t.clientX - dragStart.current.x;
                const dy = t.clientY - dragStart.current.y;
                setPan(
                    clampPan(
                        dragStart.current.panX + dx,
                        dragStart.current.panY + dy,
                        zoom,
                    ),
                );
            }
        },
        [zoom, applyZoom, clampPan],
    );

    const handleTouchEnd = useCallback(() => {
        pinchStart.current = null;
    }, []);

    // ── Legend items (stable reference) ────────────────────────────────────
    const legendItems = useMemo(
        () => [
            {
                color: COLOR_BLEED,
                label: `Bleed (${documentWidthInMM}×${documentHeightInMM}mm)`,
            },
            {
                color: COLOR_TRIM,
                label: `Finishing (${documentWidthInMM - TRIM_INSET * 2}×${documentHeightInMM - TRIM_INSET * 2}mm)`,
            },
            {
                color: COLOR_SAFE,
                label: `Safe (${documentWidthInMM - SAFE_INSET * 2}×${documentHeightInMM - SAFE_INSET * 2}mm)`,
            },
        ],
        [documentWidthInMM, documentHeightInMM],
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) resetView();
            }}
        >
            {/* ── Thumbnail trigger ── */}
            <DialogTrigger asChild>
                <div
                    {...props}
                    className="w-full cursor-pointer relative group"
                >
                    <span className="hidden">{fitScale}</span>
                    <div className="overflow-hidden rounded -z-10">
                        <PreviewContent
                            fileUrl={imageUrl}
                            width={baseW}
                            height={baseH}
                        />
                    </div>
                    <p className="text-xs font-semibold text-center py-2">
                        {fileType}
                    </p>
                    <p className="text-xs space-x-2.5 text-center py-2">
                        <span className="font-bold">
                            Cell count: {cellCount}
                        </span>
                        {!isPdf && (
                            <span className="font-bold">
                                Color: {colorSpace}
                            </span>
                        )}
                        <span className="font-bold">
                            Size: {documentHeightInMM} × {documentWidthInMM} MM
                        </span>
                    </p>
                    <p className="text-muted-foreground text-center text-xs py-2">
                        Click on the image to preview full image
                    </p>
                </div>
            </DialogTrigger>

            {/* ── Dialog ── */}
            <DialogContent
                style={{ width: "560px", maxWidth: "95vw" }}
                className="flex flex-col items-center gap-3 p-5"
            >
                {/* ── Zoom controls ── */}
                <div className="flex items-center gap-3 w-full justify-center shrink-0">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleZoomOut}
                        disabled={zoom <= MIN_ZOOM}
                        aria-label="Zoom out"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </Button>

                    <div className="w-36">
                        <Slider
                            value={[zoom]}
                            min={MIN_ZOOM}
                            max={MAX_ZOOM}
                            step={ZOOM_STEP}
                            onValueChange={handleSliderChange}
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleZoomIn}
                        disabled={zoom >= MAX_ZOOM}
                        aria-label="Zoom in"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>

                    <span className="text-xs font-medium text-muted-foreground tabular-nums w-12 text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                </div>
                {/* ── Fixed-size viewport ── */}
                <div
                    ref={viewportRef}
                    style={{
                        width: DIALOG_CANVAS_W,
                        height: DIALOG_CANVAS_H,
                        overflow: "hidden",
                        position: "relative",
                        flexShrink: 0,
                        cursor:
                            zoom > 1
                                ? isDragging
                                    ? "grabbing"
                                    : "grab"
                                : "default",
                        borderRadius: "4px",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onWheel={handleWheel}
                    onDoubleClick={handleDoubleClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* ── Transformable canvas ── */}
                    <div
                        style={{
                            position: "absolute",
                            top: (DIALOG_CANVAS_H - baseH) / 2,
                            left: (DIALOG_CANVAS_W - baseW) / 2,
                            width: baseW,
                            height: baseH,
                            transformOrigin: "center center",
                            transition: isDragging
                                ? "none"
                                : "transform 0.15s ease-out",
                            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                            willChange: "transform",
                            userSelect: "none",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                overflow: "hidden",
                            }}
                        >
                            <PreviewContent
                                fileUrl={imageUrl}
                                width={baseW}
                                height={baseH}
                            />
                        </div>

                        <GuideOverlay inset={0} color={COLOR_BLEED} />
                        <GuideOverlay inset={trimPx} color={COLOR_TRIM} />
                        <GuideOverlay inset={safePx} color={COLOR_SAFE} />
                    </div>
                </div>

                {/* ── Legend ── */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        fontSize: "12px",
                        width: "100%",
                        flexShrink: 0,
                    }}
                >
                    {legendItems.map(({ color, label }) => (
                        <div
                            key={label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "24px",
                                    height: "0px",
                                    borderTop: `2px dashed ${color}`,
                                }}
                            />
                            <span
                                style={{
                                    color: "var(--muted-foreground, #6b7280)",
                                }}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
