@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Дистанционная Приёмка v21

echo ====================================================================
echo   ДИСТАНЦИОННАЯ ПРИЁМКА v21 - ручной чек-лист и две формы Excel
echo ====================================================================
echo.

set "PYTHON_CMD="
where py >nul 2>nul && set "PYTHON_CMD=py -3"
if not defined PYTHON_CMD where python >nul 2>nul && set "PYTHON_CMD=python"

if not defined PYTHON_CMD (
  echo Python не найден. Открываю автономную версию сайта.
  echo Браузерная выгрузка Excel продолжит работать локально.
  start "" "%~dp0index.html"
  pause
  exit /b 0
)

echo Запускаем локальный сайт. Дополнительные модули не требуются.
%PYTHON_CMD% "%~dp0start_server.py"
if errorlevel 1 (
  echo.
  echo Сервер завершился с ошибкой. Открываю автономную версию.
  start "" "%~dp0index.html"
)
pause
