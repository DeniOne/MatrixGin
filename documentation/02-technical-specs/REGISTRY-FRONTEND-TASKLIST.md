# SYSTEM REGISTRY UI — FRONTEND TASKLIST

## 1. ROUTING
- /registry/*
- registry-specific layout

## 2. PAGES
- RegistryHomePage
- RegistryEntityListPage
- RegistryEntityCreatePage
- RegistryEntityEditPage
- RegistryEntityAuditPage

## 3. COMPONENTS
- RegistryTable
- RegistryForm
- LifecycleButtons
- AuditModal

## 4. STATE
- RTK Query slice: registryApi
- Endpoints mapped 1:1 to REGISTRY-API-CONTRACT

## 5. ACCESS
- RBAC guard at route level
- menu visibility guard

## 6. TESTS
- create entity
- reject duplicate code
- activate
- archive
- audit visible
