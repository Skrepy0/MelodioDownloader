# -*- mode: python ; coding: utf-8 -*-

import os
import sys
from pathlib import Path

BASE_DIR = Path(os.path.dirname(os.path.abspath(sys.argv[0])))

a = Analysis(
    [str(BASE_DIR / 'src/scripts/main.py')],   
    pathex=[str(BASE_DIR)],                    
    binaries=[],                               
    datas=[],                                  
    hiddenimports=[],
    hookspath=[],                             
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],                              
    noarchive=False,
    optimize=0,                               
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='main',                               
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,                                  
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,                              
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)