export class Utils {
    static slugify(text: string) {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

    static getHeader(token: string) {
        const header = new Headers();
        header.set('Authorization', `Bearer ${token}`);
        return header;
    }
}
