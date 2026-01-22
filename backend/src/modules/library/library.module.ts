import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentService } from './services/document.service';
import { VersionService } from './services/version.service';
import { LinkService } from './services/link.service';

@Module({
    providers: [
        PrismaService,
        DocumentService,
        VersionService,
        LinkService,
    ],
    exports: [
        DocumentService,
        VersionService,
        LinkService,
    ],
})
export class LibraryModule { }
