import React from "react";
import MaterialTable from "material-table";
import { Button, ThemeProvider, createTheme } from "@mui/material";

export function CustomTable() {
  const defaultMaterialTheme = createTheme();
  const [showDialog, setShowDialog] = React.useState(false);

  const handleDelete = () => {
    setShowDialog(true);
  };
  const handleClose = () => {
    setShowDialog(false);
  };

  const bgColor = "#ded6d6";
  const color = "#000";

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MaterialTable
        title="会議一覧表"
        style={{
          backgroundColor: bgColor,
          color: color,
        }}
        columns={[
          { title: "動画ID", field: "id" },
          { title: "動画タイトル", field: "title" },
          { title: "ビデオの説明", field: "content" },
          {
            title: "会議の削除",
            field: "delete",
            render: () => (
              <Button
                style={{
                  backgroundColor: "green",
                  color: "white",
                }}
                onClick={handleDelete}
              >
                削除
              </Button>
            ),
          },
        ]}
        data={[
          {
            id: "2021-01-01-14",
            title: "動画1",
            content: "ビデオの説明",
          },
          {
            id: "2021-05-01-14",
            title: "動画2",
            content: "ビデオの説明",
          },
          {
            id: "2022-06-16-14",
            title: "動画3",
            content: "ビデオの説明",
          },
        ]}
        options={{
          selection: true,
          sorting: true,
          pageSizeOptions: [5, 10],
          addRowPosition: "last",
          headerStyle: {
            backgroundColor: bgColor,
            color: color,
          },
          rowStyle: {
            backgroundColor: bgColor,
            color: color,
          },
        }}
        localization={{
          body: {
            emptyDataSourceMessage: "エントリーなし",
            addTooltip: "追加",
            deleteTooltip: "削除",
            editTooltip: "編集",
            filterRow: {
              filterTooltip: "フィルター",
            },
            editRow: {
              deleteText: "この行を本当に削除しますか？",
              cancelTooltip: "キャンセル",
              saveTooltip: "保存",
            },
          },
          grouping: {
            placeholder: "列をドラッグしてグループ化します...",
            groupedBy: "グループ化された項目:",
          },
          header: {
            actions: "アクション",
          },
          pagination: {
            labelDisplayedRows: "{count}件中{from}-{to}件目",
            labelRowsSelect: "行",
            labelRowsPerPage: "ページごとの行数:",
            firstAriaLabel: "最初のページ",
            firstTooltip: "最初のページ",
            previousAriaLabel: "前のページ",
            previousTooltip: "前のページ",
            nextAriaLabel: "次のページ",
            nextTooltip: "次のページ",
            lastAriaLabel: "最後のページ",
            lastTooltip: "最後のページ",
          },
          toolbar: {
            addRemoveColumns: "列の追加または削除",
            nRowsSelected: "選択された行数: {0}行",
            showColumnsTitle: "列の表示",
            showColumnsAriaLabel: "列の表示",
            exportTitle: "エクスポート",
            exportAriaLabel: "エクスポート",
            searchTooltip: "検索",
            searchPlaceholder: "検索",
          },
        }}
        actions={[
          {
            tooltip: "選択したユーザーをすべて削除",
            icon: "delete",
            onClick: (evt, data) => alert("削除されました。"),
          },
        ]}
      />
    </ThemeProvider>
  );
}
