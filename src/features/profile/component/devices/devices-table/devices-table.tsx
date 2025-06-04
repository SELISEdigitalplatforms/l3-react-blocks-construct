import { Loader2, Trash } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState, useEffect, useRef } from 'react';
import { IDeviceSession } from '../../../services/device.service';
import { useGetSessions } from '../../../hooks/use-sessions';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { useDeviceTableColumns } from '../devices-table-columns/devices-table-columns';
import { useTranslation } from 'react-i18next';

/**
 * DevicesTable is a component that displays a paginated list of device sessions.
 * It fetches session data based on the current page, handles infinite scrolling,
 * and processes session data to be displayed in a table format.
 *
 * @component
 * @example
 * return <DevicesTable />;
 *
 * @returns {JSX.Element} The rendered DevicesTable component.
 */

export const DevicesTable = () => {
  const [deviceSessions, setDeviceSessions] = useState<IDeviceSession[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loadingRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;
  const { t } = useTranslation();

  const { data: sessions, isLoading } = useGetSessions(page, PAGE_SIZE);
  const columns = useDeviceTableColumns();

  const parseMongoSession = (sessionStr: string) => {
    try {
      const cleanedJson = sessionStr
        .replace(/ObjectId\("([^"]*)"\)/g, '"$1"')
        .replace(/ISODate\("([^"]*)"\)/g, '"$1"')
        .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  };

  useEffect(() => {
    if (sessions) {
      const sessionsArray = sessions as unknown as string[];

      const processedSessions = sessionsArray
        .map((sessionStr) => {
          const parsed = parseMongoSession(sessionStr);
          if (!parsed) return null;

          return {
            ...parsed,
            IssuedUtc: new Date(parsed.IssuedUtc),
            ExpiresUtc: new Date(parsed.ExpiresUtc),
            CreateDate: new Date(parsed.CreateDate),
            UpdateDate: new Date(parsed.UpdateDate),
          } as IDeviceSession;
        })
        .filter((session): session is IDeviceSession => session !== null);

      setDeviceSessions((prev) => {
        const newSessions = page === 0 ? processedSessions : [...prev, ...processedSessions];
        return newSessions;
      });
      setHasMore(processedSessions.length === PAGE_SIZE);
    } else {
      if (page === 0) {
        setDeviceSessions([]);
      }
      setHasMore(false);
    }
  }, [sessions, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, isLoading]);

  const table = useReactTable({
    data: deviceSessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (deviceSessions.length === 0) {
      return <p className="text-center">{t('NO_DEVICES_FOUND')}</p>;
    }

    return null;
  };

  return (
    <div className="flex">
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-high-emphasis">{t('MY_DEVICES')}</CardTitle>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
              <Trash className="w-3 h-3 opacity-50 cursor-not-allowed" />
              <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap opacity-50 cursor-not-allowed">
                {t('REMOVE_ALL_DEVICES')}
              </span>
            </Button>
          </div>
          <CardDescription />
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table className="text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="px-4 py-3 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-bold text-medium-emphasis">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {deviceSessions.length > 0 ? (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer font-normal text-medium-emphasis"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <div ref={loadingRef} className="h-8 flex items-center justify-center">
                          {renderTableContent()}
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {renderTableContent()}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevicesTable;
