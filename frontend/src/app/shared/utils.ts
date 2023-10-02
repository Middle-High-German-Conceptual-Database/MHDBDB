
/**
    Class for common Utilities
**/
export class Utils {
    /**  Remove NS from Uri **/
    public static removeNameSpace(val: string) {
        const vals = val.split('/');
        const val2 = vals[vals.length - 1];
        const vals2 = val2.split('#');
        return vals2[vals2.length - 1];
    }

    public static removeNameSpaceFromTextUri(val: string) {
        const vals = val.split('/');
        const val2 = vals[vals.length - 2];
        return val2;
    }
}